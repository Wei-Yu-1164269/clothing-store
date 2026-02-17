import { useEffect, useState } from "react";
import { fetchProduct } from "../api/productApi";
import type { Product } from "../types/product";
import styles from "./ProductPage.module.css";
import SizeSelector from "../components/Product/SizeSelector/SizeSelector";

import { useCart } from "../context/useCart";

type LoadState = "idle" | "loading" | "success" | "error";

export default function ProductPage() {
  // ✅ 所有 hooks 必须放在最顶层，不能放在任何 return/if 后面
  const [state, setState] = useState<LoadState>("idle");
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string>("");

  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState("loading");
      setError("");

      try {
        const data = await fetchProduct(1);
        // test code
        // const data = await fetchProduct(2);
        if (cancelled) return;
        setProduct(data);
        setState("success");
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        setState("error");
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSelectSize(sizeId: number) {
    setSelectedSizeId(sizeId);
    setShowSizeError(false);
  }

  function handleAddToCart() {
    if (!product) return;

    if (!selectedSizeId) {
      setShowSizeError(true);
      return;
    }

    const size = product.sizeOptions.find((s) => s.id === selectedSizeId);

    if (!size) return;

    addToCart(product, size);
  }

  // ✅ 下面这些 return 随便放，因为 hooks 已经都执行完了
  if (state === "loading" || state === "idle") {
    return (
      <div className={styles.stateBox}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={styles.stateBox}>
        <h2>Failed to load product</h2>
        <p className={styles.errorText}>{error}</p>
        <button
          className={styles.retryBtn}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <div className={styles.imageWrap}>
          <img
            className={styles.image}
            src={product.imageURL}
            alt={product.title}
          />
        </div>

        <div>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          <p className={styles.desc}>{product.description}</p>

          <SizeSelector
            options={product.sizeOptions}
            selectedSizeId={selectedSizeId}
            onChange={handleSelectSize}
            showError={showSizeError}
          />

          <button
            className={styles.addBtn}
            type="button"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}
