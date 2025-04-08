import type { Metadata } from "next";
import CartClient from "./cart-client";

export const metadata: Metadata = {
  title: "Shopping Cart | SparkleWash",
  description: "View and manage your shopping cart",
};

export default function CartPage() {
  return <CartClient />;
}
