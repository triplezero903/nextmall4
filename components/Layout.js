import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + " - NextMall" : "NextMall"}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col h-screen justify-between">
        <nav className="flex justify-between items-center bg-slate-200 h-12">
          <Link href="/">
            <a className="text-lg font-bold">NextMall</a>
          </Link>
          <div>
            <Link href="/cart">
              <a className="p-2">Cart</a>
            </Link>
            <Link href="/login">
              <a className="p-2">Login</a>
            </Link>
          </div>
        </nav>
        <main className="container m-auto mt-4 px-4">{children}</main>

        <footer className="flex h-10 bg-red-100 justify-center items-center shadow-inner">
          <p> Copyright &copy; 2022, NextMall</p>
        </footer>
      </div>
    </>
  );
}
