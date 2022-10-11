import Head from "next/head";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <Layout title="홈페이지">
      <div className="">
        <h1 className="text-3xl font-bold">Tailwind CSS</h1>
        <p>웹서버프로그래밍, 손경현.</p>
      </div>
    </Layout>
  );
}
