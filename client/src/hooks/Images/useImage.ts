import { useQueries, useQuery } from "react-query";

import { fetchImageRequest } from "../../services/images";

const useImage = (id: number) => {
  return useQuery(["image", id], () => fetchImageRequest(id));
};

export const useImages = (ids: number[] = []) => {
  return useQueries(
    ids.map((id) => ({
      queryKey: ["image", id],
      queryFn: () => fetchImageRequest(id),
    }))
  );
};

export default useImage;
