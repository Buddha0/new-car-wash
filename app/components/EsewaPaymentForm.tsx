'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface EsewaPaymentFormProps {
  orderId: string;
  totalAmount: number;
}

export default function EsewaPaymentForm({ orderId, totalAmount }: EsewaPaymentFormProps) {
  const [loading, setLoading] = useState(false);
  
  // Function to initialize eSewa payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Open a new window for the payment process
      const paymentWindow = window.open('', '_blank');
      
      if (!paymentWindow) {
        toast.error('Pop-up blocked. Please allow pop-ups and try again.');
        setLoading(false);
        return;
      }
      
      paymentWindow.document.write('<html><body><h3>Loading eSewa payment...</h3></body></html>');
      
      // Call our API to initialize payment
      const response = await fetch('/api/payments/esewa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          orderId, 
          // Send as an integer for test environment
          totalAmount: Math.round(totalAmount)
        }),
      });
      
      if (!response.ok) {
        // Close the window if there's an error
        paymentWindow.close();
        throw new Error('Failed to initialize payment');
      }
      
      // Get the HTML content directly
      const htmlContent = await response.text();
      
      // Write the HTML to the new window and let it auto-submit
      paymentWindow.document.write(htmlContent);
      paymentWindow.document.close();
      
      // Reset loading state after a delay to allow the user to see the button change
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize eSewa payment. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="mt-4">
      {/* Visible button for the user to click */}
      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {loading ? 'Processing...' : 'Pay with eSewa'}
      </Button>
      
      <p className="text-xs text-gray-500 mt-2">
        You will be redirected to eSewa to complete your payment.
      </p>
    </div>
  );
} 