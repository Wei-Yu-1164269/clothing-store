import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { CartProvider } from "../context/CartProvider";

const mockProduct = {
  id: 1,
  title: "Classic Tee",
  description: "A classic tee.",
  imageURL: "http://test/image.jpg",
  price: 75,
  sizeOptions: [
    { id: 1, label: "S" },
    { id: 2, label: "M" },
  ],
};

beforeEach(() => {
  localStorage.clear();

  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    } as Response),
  );
});

describe("Product flow (ProductPage + Cart)", () => {
  it("should show error if size not selected", async () => {
    render(
      <CartProvider>
        <App />
      </CartProvider>,
    );

    const addBtn = await screen.findByRole("button", { name: /add to cart/i });
    await userEvent.click(addBtn);

    expect(screen.getByText(/please select a size/i)).toBeInTheDocument();
  });

  it("should merge same size into one cart item", async () => {
    render(
      <CartProvider>
        <App />
      </CartProvider>,
    );

    const sizeBtn = await screen.findByText("S");
    const addBtn = screen.getByText(/add to cart/i);

    await userEvent.click(sizeBtn);
    await userEvent.click(addBtn);
    await userEvent.click(addBtn);

    // 打开购物车
    const cartBtn = screen.getByText(/my cart/i);
    await userEvent.click(cartBtn);

    const sizeRows = screen.getAllByText(/size: s/i);
    expect(sizeRows.length).toBe(1);

    expect(screen.getByText(/qty: 2/i)).toBeInTheDocument();
  });

  it("should persist cart in localStorage after reload", async () => {
    // 第一次“打开页面”
    const { unmount } = render(<App />);

    const sizeBtnS = await screen.findByRole("button", { name: "S" });
    const addBtn = screen.getByRole("button", { name: /add to cart/i });

    await userEvent.click(sizeBtnS);
    await userEvent.click(addBtn); // 加 1 次，My Cart 应该变成 1

    // 等待 localStorage 写入（useEffect 异步执行）
    // 简单做法：等待 header 上的数量变化
    await screen.findByRole("button", { name: /my cart\s*\(\s*1\s*\)/i });

    // “刷新页面”：卸载组件树
    unmount();

    // 第二次“打开页面”（同一个 localStorage）
    render(<App />);

    // 这次不需要再点 add，直接验证 header 数量仍然是 1
    await screen.findByRole("button", { name: /my cart\s*\(\s*1\s*\)/i });

    // 打开 mini cart 验证内容也存在（可选但更强）
    const myCartBtn = screen.getByRole("button", { name: /my cart/i });
    await userEvent.click(myCartBtn);

    const miniCart = await screen.findByTestId("mini-cart");
    expect(miniCart).toBeInTheDocument();

    expect(await screen.findByText(/qty:\s*1/i)).toBeInTheDocument();
  });
});
