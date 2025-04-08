"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

export function CartIcon() {
  const { totalItems } = useCart()

  return (
    <Link href="/dashboard/user/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
          >
            {totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  )
} 