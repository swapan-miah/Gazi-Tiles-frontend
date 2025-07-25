import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";

export interface IProduct {
  _id: string;
  company: string;
  product_code: string;
}

const fetchProducts = async () => {
  const res = await axios.get("http://localhost:5000/api/product/all");
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
      <ProductList products={products} />
    </div>
  );
};

export default Product;
