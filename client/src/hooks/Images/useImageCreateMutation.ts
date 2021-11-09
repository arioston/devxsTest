import { useMutation, useQueryClient } from "react-query";
import { createImageRequest } from "../../services/images";

const useImageCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createImageRequest, {
    onSuccess: (data, variable, context) => {
      queryClient.invalidateQueries("images");
    },
  });
};

export default useImageCreateMutation;
