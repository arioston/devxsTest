import { useMutation, useQueryClient } from "react-query";
import { deleteImageRequest } from "../../services/images";

const useImageDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteImageRequest, {
    onSuccess: (data, variable, context) => {
      queryClient.invalidateQueries("images");
      queryClient.invalidateQueries("products");
    },
  });
};

export default useImageDeleteMutation;
