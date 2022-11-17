import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProductItems from "../components/ProductItem";
import Product from "../models/Product";
//import data from "../utils/data";
import db from "../utils/db";
import { Store } from "../utils/Store";

export default function Home({ products }) {

  const {state, dispatch} = useContext(Store)
  const {cart} = state
  
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)

    if(data.countInStock < quantity) {
      return toast.error("죄송합니다. 재고가 다 나갔습니다.")
    }
    dispatch({type:"CART_ADD_ITEM", payload: {...product, quantity}})

    toast.success("상품이 카트에 추가되었습니다.")
  }

  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {products.map((product) => (
          <ProductItems product={product} addToCartHandler={addToCartHandler} key={product.slug}></ProductItems>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
