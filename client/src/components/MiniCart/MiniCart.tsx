import { useCart } from "../../context/useCart";
import styles from "./MiniCart.module.css";

export default function MiniCart() {
  const { cart, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return <div className={styles.box} data-testid="mini-cart">Cart is empty.</div>;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className={styles.box} data-testid="mini-cart">
      <div className={styles.topRow}>
        <div className={styles.title}>Cart</div>
        <button className={styles.linkBtn} onClick={clearCart}>
          Clear
        </button>
      </div>

      {cart.map((item) => (
        <div key={`${item.productId}-${item.sizeId}`} className={styles.item}>
          <img className={styles.thumb} src={item.imageURL} alt={item.title} />

          <div className={styles.info}>
            <div className={styles.name}>{item.title}</div>
            <div className={styles.meta}>Size: {item.sizeLabel}</div>
            <div className={styles.meta}>Qty: {item.quantity}</div>
            <div className={styles.meta}>${item.price.toFixed(2)}</div>
          </div>

          <button
            className={styles.removeBtn}
            onClick={() => removeFromCart(item.productId, item.sizeId)}
          >
            ✕
          </button>
        </div>
      ))}
      <div className={styles.footer}>
        <div className={styles.subtotalRow}>
          <span>Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}
