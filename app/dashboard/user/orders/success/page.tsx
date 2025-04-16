"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  
  // Clear the cart when payment is successful
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <DashboardLayout userRole="user">
      <div className="container mx-auto py-10 max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your payment has been processed successfully. Thank you for your purchase!
            </p>
            <p className="mt-2 text-muted-foreground">
              You will receive a confirmation email shortly.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button onClick={() => router.push("/dashboard/user/orders")}>
              View My Orders
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/user/products")}>
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
} 