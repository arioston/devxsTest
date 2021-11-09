import { useMutation, useQueryClient } from "react-query";
import { createProductsRequest } from "../../services/products";

const useProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createProductsRequest, {
    onSuccess: (data, variable, context) => {
      queryClient.invalidateQueries("products");
    },
  });
};

export default useProductMutation;
