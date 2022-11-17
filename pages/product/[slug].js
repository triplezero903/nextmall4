import Image from "next/image";
import Link from "next/link";
//import { useRouter } from "next/router";
import Router form "next/router"
import React, { useContext } from "react";
import Layout from "../../components/Layout";
import Product from "../../models/Product";
//import data from "../../utils/data";
import db from "../../utils/db";
import { Store } from "../../utils/Store";
import axios from "axios"

export default function ProductScreen({ product }) {
  const { state, dispatch } = useContext(Store);
  //const { query } = useRouter();
  //const { slug } = query;
  //const product = data.products.find((x) => x.slug === slug);

  if (!product) {
    return <Layout title="Product Not Found">상품을 찾을 수 없습니다!!</Layout>;
  }

  const addToCartHandler = async() => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const data = await axios.get(`/api/products/${product._id}`)

    if (data.countInStock < quantity) {
      alert("죄송합니다. 재고가 부족합니다.");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    Router.push("/cart");
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/"> 상품으로 돌아가기</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </div>

        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>가격</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>재고 상태</div>
              <div>{product.countInStock > 0 ? "In stock" : "Unavailable"}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              카트에 넣기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
