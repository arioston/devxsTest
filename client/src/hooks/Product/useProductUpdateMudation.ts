import { useMutation, useQueryClient } from "react-query";
import { updatecreateProductsRequest } from "../../services/products";

const useProductUpdateMudation = () => {
  const queryClient = useQueryClient();

  return useMutation(updatecreateProductsRequest, {
    onSuccess: (data, variable, context) => {
      queryClient.invalidateQueries("products");
      queryClient.invalidateQueries(["product", data.data.id]);
    },
  });
};

export default useProductUpdateMudation;
