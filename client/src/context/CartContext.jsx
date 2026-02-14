/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import { productsApi } from "../api/products";

// Cart state and product list are shared across the app via this context
const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

// Load initial cart from browser storage (runs once on mount)
function getInitialCart() {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCart);
  const [products, setProducts] = useState([]);
  const { showToast } = useToast();

  // Save cart to browser storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  async function fetchProducts() {
    try {
      const { data } = await productsApi.getAll();
      if (data?.success && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    }
  }

  function addToCart(product) {
    const maxStock = product.totalStock || 0;

    setCartItems((prev) => {
      const found = prev.find((item) => item._id === product._id);
      const currentQty = found ? found.quantity : 0;

      if (currentQty >= maxStock) {
        showToast(`Only ${maxStock} items available in stock!`, "warning");
        return prev;
      }

      if (!found) {
        showToast(`${product.title} added to cart`, "success");
        return [...prev, { ...product, quantity: 1 }];
      }

      return prev.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    showToast("Item removed from cart", "info");
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) => {
      const item = prev.find((i) => i._id === productId);
      const stock = item?.totalStock || 0;

      if (quantity > stock) {
        showToast(`Only ${stock} items available in stock!`, "warning");
        return prev;
      }

      return prev.map((i) => (i._id === productId ? { ...i, quantity } : i));
    });
  }

  function clearCart() {
    setCartItems([]);
    showToast("Cart cleared", "info");
  }

  function getTotal() {
    return cartItems.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + price * item.quantity;
    }, 0);
  }

  function getItemCount() {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  function isInStock(product) {
    const cartItem = cartItems.find((item) => item._id === product._id);
    const cartQty = cartItem ? cartItem.quantity : 0;
    return (product.totalStock || 0) > cartQty;
  }

  function getAvailableStock(product) {
    const cartItem = cartItems.find((item) => item._id === product._id);
    const cartQty = cartItem ? cartItem.quantity : 0;
    return Math.max(0, (product.totalStock || 0) - cartQty);
  }

  const value = {
    cartItems,
    products,
    fetchProducts,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    isInStock,
    getAvailableStock,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
