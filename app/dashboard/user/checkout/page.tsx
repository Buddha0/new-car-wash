"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

// Define interface for eSewa payment data
interface EsewaPaymentData {
  payment_id: string;
  transaction_uuid: string;
  product_code: string;
  total_amount: number;
  signature: string;
  signed_field_names: string;
}

// eSewa testing environment URL
const ESEWA_FORM_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
// Production URL: 'https://epay.esewa.com.np/api/epay/main/v2/form'

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const router = useRouter();

  // Calculate totals
  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  const tax = Math.round(subtotal * 0.13 * 100) / 100; // 13% VAT
  const total = subtotal + tax;

  useEffect(() => {
    // Only redirect if cart is empty and we're not in the middle of payment processing
    if (items.length === 0 && !processingPayment) {
      router.push("/dashboard/user/cart");
    }
  }, [items.length, router, processingPayment]);

  // Create order and initialize payment
  const createOrder = async () => {
    setIsLoading(true);
    
    try {
      // Mark that we're processing a payment to prevent unwanted redirects
      setProcessingPayment(true);
      
      // Create order first
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: total,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();
      setOrderId(orderData.id);
      console.log("Order created:", orderData.id);

      // Create the form directly in the current window
      const formContainer = document.createElement('div');
      formContainer.style.position = 'fixed';
      formContainer.style.top = '0';
      formContainer.style.left = '0';
      formContainer.style.width = '100%';
      formContainer.style.height = '100%';
      formContainer.style.zIndex = '9999';
      formContainer.style.backgroundColor = 'rgba(255,255,255,0.9)';
      formContainer.style.display = 'flex';
      formContainer.style.alignItems = 'center';
      formContainer.style.justifyContent = 'center';
      formContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="margin-bottom: 10px;">Redirecting to eSewa...</h2>
          <p>Please wait while we connect to eSewa payment gateway.</p>
          <div style="margin-top: 20px; width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 20px auto;"></div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </div>
      `;
      document.body.appendChild(formContainer);

      // Initialize eSewa payment
      const paymentResponse = await fetch("/api/payments/esewa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderData.id,
          totalAmount: Math.round(total), // Send rounded total amount
        }),
      });

      if (!paymentResponse.ok) {
        // Remove loading overlay
        document.body.removeChild(formContainer);
        throw new Error("Failed to initialize payment");
      }

      // Get the HTML content directly and submit in the main window
      const htmlContent = await paymentResponse.text();
      
      // Extract the form from the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Find the form element in the parsed HTML
      const esewaForm = tempDiv.querySelector('form');
      
      if (!esewaForm) {
        throw new Error("Could not find eSewa form in the response");
      }
      
      // Create a new form in the current page
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = ESEWA_FORM_URL;
      form.style.display = 'none';
      
      // Copy all input fields from the extracted form
      const inputs = esewaForm.querySelectorAll('input');
      inputs.forEach(input => {
        const newInput = document.createElement('input');
        newInput.type = input.type;
        newInput.name = input.name;
        newInput.value = input.value;
        form.appendChild(newInput);
      });
      
      // Append the form to the document and submit it
      document.body.appendChild(form);
      form.submit();
      
      // Clear the cart after form submission
      clearCart();
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout");
      setIsLoading(false);
      setProcessingPayment(false);
    }
  };

  return (
    <DashboardLayout userRole="user">
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review your items before payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Complete your purchase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (13%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={createOrder}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    "Pay with eSewa"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 