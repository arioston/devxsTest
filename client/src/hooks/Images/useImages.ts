import { useQuery } from "react-query";

import { fetchImagesRequest } from "../../services/images";

const useImages = () => {
  return useQuery("images", fetchImagesRequest);
};

export default useImages;
