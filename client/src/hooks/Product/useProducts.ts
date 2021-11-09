import { useQuery } from "react-query";
import { fetchProductsRequest } from "../../services/products";

const useProducts = () => {
  return useQuery("products", fetchProductsRequest);
};

export default useProducts;
