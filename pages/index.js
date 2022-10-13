import Layout from "../components/Layout";
import ProductItems from "../components/ProductItems";
import data from "../utils/data";

export default function Home() {
  return (
    <Layout title="Home">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {data.products.map((product) => (
          <ProductItems product={product} key={product.slug} />
        ))}
      </div>
    </Layout>
  );
}
