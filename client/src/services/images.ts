import api from "./api";

export interface Image {
  id: number | string;
  fileName: string;
  filePath: string;
}

export const createImageRequest = async (data: any) => {
  const product = await api.post<Image>("/images", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return product;
};

export const fetchImageRequest = async (imageId: number) => {
  const product = await api.get<Image>(`/images/${imageId}`);
  return product;
};

export const fetchImagesRequest = async () => {
  const product = await api.get<Image[]>(`/images`);
  return product;
};

export const deleteImageRequest = async (id: number | string) => {
  const product = await api.delete<Image[]>(`/images/${id}`);
  return product;
};
