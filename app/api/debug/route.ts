import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// eSewa credentials for testing
const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q';
const ESEWA_PRODUCT_CODE = 'EPAYTEST';

// Generate HMAC SHA256 signature
function generateSignature(data: string, secretKey: string): string {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(data);
  return hmac.digest('base64');
}

export async function GET(request: Request) {
  try {
    // Generate a unique transaction UUID
    const transactionUuid = uuidv4();
    
    // Sample amount (100 NPR)
    const amount = "100";
    
    // Create sample signature string as per eSewa docs
    const signatureString = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
    
    // Generate signature
    const signature = generateSignature(signatureString, ESEWA_SECRET_KEY);
    
    // Get origin for URLs
    const url = new URL(request.url);
    const origin = url.origin;
    
    // Sample form data to send to eSewa
    const formData = {
      amount: amount,
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${origin}/api/payments/esewa/success`,
      failure_url: `${origin}/api/payments/esewa/failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature
    };
    
    // HTML form for direct testing
    const formHtml = `
      <html>
        <head>
          <title>eSewa Test Form</title>
        </head>
        <body>
          <h2>eSewa Test Form</h2>
          <p>Signature String: ${signatureString}</p>
          <p>Generated Signature: ${signature}</p>
          <form method="POST" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form">
            ${Object.entries(formData).map(([key, value]) => 
              `<input type="hidden" name="${key}" value="${value}" />`
            ).join('')}
            <button type="submit">Submit Test Payment</button>
          </form>
        </body>
      </html>
    `;
    
    // Return debug information
    return new NextResponse(formHtml, {
      headers: {
        'Content-Type': 'text/html'
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Debug error' }, { status: 500 });
  }
} 