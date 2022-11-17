import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import { XCircleIcon } from "@heroicons/react/outline";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import axios from "axios";

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`)

    if(data.countInStock < quantity) {
      return toast.error("죄송합니다. 재고가 다 나갔습니다.")
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });

    toast.success("상품이 카트에 업데이트 되었습니다.")
  };
  return (
    <Layout title={"Shopping Cart"}>
      <h1 className="mb-4 text-xl">Shopping Cart - 쇼핑 카트</h1>
      {cartItems.length === 0 ? (
        <div>
          카트가 비었습니다. <Link href="/">쇼핑하러 가기</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md-gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <th className="p-5 text-left">상품</th>
                <th className="p-5 text-right">수량</th>
                <th className="p-5 text-right">가격</th>
                <th className="p-5">지우기</th>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link href={`/product/${item.slug}`}>
                        <a className="flex items-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;{item.name}
                        </a>
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">{item.quantity}</td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : ${" "}
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <button
                onClick={() => router.push("login?redirect=/shipping")}
                className="primary-button w-full"
              >
                Check Out
              </button>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
