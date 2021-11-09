import "twin.macro";

import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useImages } from "../../hooks/Images/useImage";
import useProductDeleteMutation from "../../hooks/Product/useProductDeleteMutation";
import useProductMutation from "../../hooks/Product/useProductMutation";
import useProducts from "../../hooks/Product/useProducts";
import useProductUpdateMudation from "../../hooks/Product/useProductUpdateMudation";
import { Product } from "../../services/products";
import UploadPhotoModal from "./components/UploadPhotoModal";

interface Item extends Product {
  key: string;
}

interface ProductEditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Product;
  index: number;
  children: React.ReactNode;
}

const EditableCell: FC<ProductEditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const toItem = (product: Product): Item => ({
  id: product.id || " ",
  name: product.name || " ",
  description: product.description || " ",
  price: product.price || 0,
  publishedAt: product.publishedAt,
  images: product.images,
  key: product.id.toString(),
});

const fromItem = (item: Item): Product => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: item.price,
  publishedAt: item.publishedAt,
  images: item.images,
});

const TempId = "newRecord";

interface ProductImagesProps {
  imagesIds: number[];
}

const ProductImages: FC<ProductImagesProps> = ({ imagesIds }) => {
  const userQueries = useImages(imagesIds);

  return (
    <div tw="flex flex-row flex-wrap">
      {userQueries
        .filter((res) => res.data?.data)
        .map(({ data }) => (
          <Avatar
            key={data?.data.id}
            size={80}
            src={`http://localhost:3001/public/${data?.data.fileName}`}
          />
        ))}
    </div>
  );
};

export const Products = () => {
  const [form] = Form.useForm();
  const { data, isFetching } = useProducts();
  const { mutateAsync: createProduct } = useProductMutation();
  const { mutateAsync: updateProduct } = useProductUpdateMudation();
  const { mutateAsync: deleteProduct } = useProductDeleteMutation();
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [editingKey, setEditingKey] = useState("");
  const [imageManagerKey, setImageManagerKey] = useState<string | number>();

  const productsColumns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      editable: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      editable: true,
      render: (_: any, record: Item) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(record.price);
      },
    },
    {
      title: "Published At",
      dataIndex: "publishedAt",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key!)}
              style={{ marginRight: 8 }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div tw="flex justify-between flex-wrap flex-col">
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure to Delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Typography.Link>Delete</Typography.Link>
            </Popconfirm>
            <Typography.Link
              disabled={!!imageManagerKey}
              onClick={() => setImageManagerKey(record.id)}
            >
              Manager Images
            </Typography.Link>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setDataSource(data?.data ? data?.data.map((d) => toItem(d)) : []);
  }, [data]);

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({
      name: "",
      description: "",
      price: 0,
      id: record.id,
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    if (editingKey == TempId) {
      setDataSource((prev) => prev.filter((d) => d.key !== TempId));
    }
    setEditingKey("");
  };

  const handleDelete = (id: string) => {
    deleteProduct(Number(id));
  };

  const handleAdd = () => {
    const existPendingItem = dataSource.find((d) => d.id === TempId);
    if (!existPendingItem) {
      const newProduct = toItem({ id: TempId } as Product);
      setDataSource((prev) => (prev ? [newProduct, ...prev] : [newProduct]));
      setEditingKey(TempId);
    } else {
      toast.warn("You must finish the pending addition.");
    }
  };

  const save = async (key: React.Key) => {
    const row = (await form.validateFields()) as Item;
    const product = fromItem(row);
    if (key == TempId) {
      createProduct(product).finally(() => setEditingKey(""));
    } else {
      product.id = key;
      updateProduct(product).finally(() => setEditingKey(""));
    }
  };

  const columns: ColumnsType<Item> = productsColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "price" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const getImagesIdFromSelectedProduct = (): number[] => {
    return (
      dataSource
        .find((d) => d.id === imageManagerKey)
        ?.images?.map((i) => i.imageId) || []
    );
  };

  return (
    <>
      <Card title="Products" tw="m-10">
        <Button onClick={handleAdd}>Add New Product</Button>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={{
              onChange: cancel,
            }}
            expandable={{
              expandedRowRender: (record) => (
                <ProductImages
                  imagesIds={record.images?.map((i) => i.imageId) || []}
                />
              ),
              rowExpandable: (record) => !!record.images?.length,
            }}
          />
        </Form>
      </Card>
      {!!imageManagerKey && (
        <UploadPhotoModal
          productId={imageManagerKey}
          visible={!!imageManagerKey}
          handleCancel={() => setImageManagerKey(undefined)}
          handleOk={() => setImageManagerKey(undefined)}
          imageIds={getImagesIdFromSelectedProduct()}
        />
      )}
    </>
  );
};
