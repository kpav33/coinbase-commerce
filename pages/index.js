import { useState } from "react";
// import Head from "next/head";
// import Image from "next/image";
import axios from "axios";

import { products } from "../data";

// import styles from "../styles/Home.module.css";

export default function Home() {
  // https://dev.to/joshuajee/how-to-accept-crypto-payments-in-a-nextjs-application-using-coinbase-commerce-303e

  return (
    <div className={"container"}>
      {products.map((product, index) => {
        return <Products key={index} product={product} />;
      })}
    </div>
  );
}

const Products = ({ product }) => {
  const [loading, setLoading] = useState(false);

  const coinbase = async () => {
    setLoading(true);
    try {
      // On successful request this route will create a payment charge using the product id and return the charge details, then the code will open a new tab on the browser using the payment link returned from coinbase commerce
      // Send post request to api route
      const data = await axios.post("/api/init", { id: product.id });
      setLoading(false);
      // Open new tab
      window.open(data.data.hosted_url, "_blank");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>{product.name}</h4>
      <p>{product.description}</p>
      <p>
        Price: {product.price} {product.currency}
      </p>
      <button onClick={coinbase} disabled={loading}>
        {" "}
        Pay With Crtpto{" "}
      </button>
    </div>
  );
};
