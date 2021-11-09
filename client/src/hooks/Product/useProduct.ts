import { useQuery } from "react-query";
import { fetchProductRequest } from "../../services/products";

const useProduct = (id: number) => {
  return useQuery(["product", id], () => fetchProductRequest(id));
};

export default useProduct;
