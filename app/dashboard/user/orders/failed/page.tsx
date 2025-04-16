"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <DashboardLayout userRole="user">
      <div className="container mx-auto py-10 max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unfortunately, your payment could not be processed. Please try again or choose a different payment method.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button onClick={() => router.push("/dashboard/user/checkout")}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/user/cart")}>
              Return to Cart
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
} 