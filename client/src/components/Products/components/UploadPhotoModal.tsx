import "twin.macro";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Modal, Upload } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { UploadFile } from "antd/lib/upload/interface";
import React, { FC, useEffect, useState } from "react";

import useImages from "../../../hooks/Images/useImages";
import useProductUpdateMudation from "../../../hooks/Product/useProductUpdateMudation";
import { Image } from "../../../services/images";
import useImageDeleteMutation from "../../../hooks/Images/useImageDeleteMutation";
import useImageCreateMutation from "../../../hooks/Images/useImageCreateMutation";
import { UploadRequestOption } from "rc-upload/lib/interface";

export interface UploadPhotoModalProps {
  visible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  productId: number | string;
  imageIds: number[];
}

const toUploadFile = (image: Image) => {
  return {
    uid: image.id,
    name: image.fileName,
    url: `http://localhost:3001/public/${image.fileName}`,
    thumbUrl: `http://localhost:3001/public/${image.fileName}`,
  } as UploadFile;
};

const UploadPhotoModal: FC<UploadPhotoModalProps> = ({
  visible,
  handleOk,
  imageIds,
  productId,
  handleCancel,
}) => {
  const { data, refetch } = useImages();
  const { mutateAsync } = useProductUpdateMudation();
  const { mutate: deleteImage } = useImageDeleteMutation();
  const { mutateAsync: uploadImage } = useImageCreateMutation();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [checkedList, setCheckedList] = React.useState(imageIds);

  const updateProduct = () => {
    mutateAsync({
      id: productId,
      images: checkedList.map((imageId) => ({ imageId })),
    }).finally(() => handleOk());
  };

  useEffect(() => {
    if (data?.data) {
      setFileList(data?.data.map(toUploadFile));
    }
  }, [data]);

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list as number[]);
  };

  const itemRenderWithCheckBox = (node: React.ReactNode, file: UploadFile) => (
    <div tw="flex items-center">
      <Checkbox
        tw="flex-1"
        value={file.uid}
        defaultChecked={imageIds.includes(Number(file.uid))}
      />
      <div style={{ flex: 10 }}>{node}</div>
    </div>
  );

  const handleRemove = (file: UploadFile<any>) => {
    deleteImage(file.uid);
    setCheckedList((prev) => {
      return prev.filter((p) => p.toString() != file.uid);
    });
  };

  const handlerUpload = ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }: UploadRequestOption) => {
    const formData = new FormData();
    if (data) {
      Object.keys(data).forEach((key) => {
        // @ts-ignore
        formData.append(key, data[key]);
      });
    }
    formData.append(filename!, file);
    uploadImage(formData)
      .then((response) => onSuccess && onSuccess(response, file as any))
      .catch(onError);
  };

  return (
    <Checkbox.Group defaultValue={checkedList} onChange={onChange}>
      <Modal
        visible={visible}
        title="Manager Images"
        onOk={updateProduct}
        onCancel={handleCancel}
      >
        <Upload
          customRequest={handlerUpload}
          listType="picture"
          fileList={fileList}
          onRemove={handleRemove}
          itemRender={itemRenderWithCheckBox}
          onChange={() => refetch()}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Modal>
    </Checkbox.Group>
  );
};

export default UploadPhotoModal;
