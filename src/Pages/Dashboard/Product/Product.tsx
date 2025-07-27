import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";

export interface IProduct {
  _id: string;
  company: string;
  product_code: string;
  height: number;
  width: number;
  per_caton_to_pcs: number;
}

const fetchProducts = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_Basic_Api}/api/product/all`
  );
  return res.data.products;
};

const Product = () => {
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery<IProduct[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <p>Loading products...</p>;

  return (
    <div className="p-4">
      <AddProduct refetch={refetch} />
      <ProductList products={products} refetch={refetch} />
    </div>
  );
};

export default Product;
