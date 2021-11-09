import { useMutation, useQueryClient } from "react-query";

import { deleteProductRequest } from "../../services/products";

const useProductDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteProductRequest, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("products");
      queryClient.invalidateQueries(["product", data.data.id]);
    },
  });
};

export default useProductDeleteMutation;
