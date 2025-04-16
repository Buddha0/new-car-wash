import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/db';

// eSewa credentials - should be in .env file in production
const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q'; // Correct secret key for UAT testing
const ESEWA_PRODUCT_CODE = 'EPAYTEST'; // For UAT testing

// Generate HMAC SHA256 signature
export function generateSignature(data: string, secretKey: string): string {
  // Use the crypto module to create HMAC with SHA256
  const hmac = crypto.createHmac('sha256', secretKey);
  // Update with the data
  hmac.update(data);
  // Return base64 encoded signature
  return hmac.digest('base64');
}

// Initialize a payment with eSewa
export async function POST(request: Request) {
  try {
    const { orderId, totalAmount } = await request.json();

    // Fetch the order to confirm it exists and get details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: { include: { product: true } } }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Generate a unique transaction UUID using uuidv4
    const transactionUuid = uuidv4();

    // Create or update a payment record in the database
    const payment = await prisma.payment.upsert({
      where: { orderId },
      update: {
        amount: order.totalAmount,
        status: 'PENDING',
        method: 'ESEWA',
        transactionId: transactionUuid,
      },
      create: {
        userId: order.userId,
        orderId: order.id,
        amount: order.totalAmount,
        status: 'PENDING',
        method: 'ESEWA',
        transactionId: transactionUuid,
      }
    });

    // Format amount - eSewa expects integers for amount values in test mode
    // eSewa examples use 100, 10, 110 for integers without decimal places
    const amount = Math.round(Number(totalAmount)).toString();
    const taxAmount = "0";
    const totalAmountFormatted = amount; // Same as amount for simplicity
    
    // Create the string to sign exactly as specified in eSewa docs
    // Format: total_amount=100,transaction_uuid=some-uuid,product_code=EPAYTEST
    const signatureString = `total_amount=${totalAmountFormatted},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;

    // Generate the HMAC SHA256 signature
    const signature = generateSignature(signatureString, ESEWA_SECRET_KEY);
    
    console.log('Generated signature string:', signatureString);
    console.log('Generated signature:', signature);

    // Get the origin for success and failure URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    // Absolute URLs are required for eSewa callbacks
    const successUrl = `${origin}/api/payments/esewa/success`;
    const failureUrl = `${origin}/api/payments/esewa/failure`;

    // eSewa form parameters exactly matching the working debug implementation
    const formData = {
      amount: amount,
      tax_amount: taxAmount,
      total_amount: totalAmountFormatted,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature
    };

    // Generate direct HTML form for testing
    const formHtml = `
      <html>
        <head>
          <title>eSewa Payment</title>
          <script>
            // Auto-submit the form when loaded
            window.onload = function() {
              document.getElementById('esewaForm').submit();
            }
          </script>
        </head>
        <body>
          <h2>Redirecting to eSewa...</h2>
          <p>Please wait, you will be redirected to eSewa payment page.</p>
          <form id="esewaForm" method="POST" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form">
            ${Object.entries(formData).map(([key, value]) => 
              `<input type="hidden" name="${key}" value="${value}" />`
            ).join('')}
          </form>
        </body>
      </html>
    `;

    // Store the transaction details for future reference
    console.log('Payment initiated:', {
      paymentId: payment.id,
      transactionUuid,
      amount: totalAmountFormatted
    });

    // Return the HTML form directly
    return new NextResponse(formHtml, {
      headers: {
        'Content-Type': 'text/html'
      }
    });
  } catch (error) {
    console.error('Error processing eSewa payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
} 