import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartDrawer } from "@/components/cart/CartDrawerContext";

/** Visiting `/cart` opens the shared cart drawer and sends the user back (footer / deep link). */
export default function CartOpenerPage() {
  const { openCart } = useCartDrawer();
  const navigate = useNavigate();

  useEffect(() => {
    openCart();
    const hasHistory = typeof window !== "undefined" && window.history.length > 1;
    navigate(hasHistory ? -1 : "/home", { replace: true });
  }, [openCart, navigate]);

  return null;
}
