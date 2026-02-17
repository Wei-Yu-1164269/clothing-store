import { useState } from "react";
import { useCart } from "../../context/useCart";
import MiniCart from "../MiniCart/MiniCart";
import styles from "./Header.module.css";

export default function Header() {
  const { totalQty } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>Moustache Republic Shop</div>

        <button
          className={styles.cartBtn}
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          My Cart ({totalQty})
        </button>
      </div>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div className={styles.panelWrap}>
            <div
              className={styles.cartPanel}
              onClick={(e) => e.stopPropagation()}
              role="presentation"
            >
              <MiniCart />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
