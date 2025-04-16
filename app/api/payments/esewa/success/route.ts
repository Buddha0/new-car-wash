import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';

// eSewa credentials - should be in .env file in production
const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q'; // Correct key for UAT testing

// Generate HMAC SHA256 signature for verification
function generateSignature(data: string, secretKey: string): string {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(data);
  return hmac.digest('base64');
}

// Validate the signature returned from eSewa
function validateSignature(data: any, signature: string): boolean {
  try {
    // Get the fields to sign - these are the fields used in the signed_field_names
    const fieldsToSign = data.signed_field_names.split(',');
    
    // Create the signature string in the same format as when creating the payment
    // Format: field1=value1,field2=value2,field3=value3
    const valuesArray = fieldsToSign.map((field: string) => `${field}=${data[field]}`);
    const dataToSign = valuesArray.join(',');
    
    console.log('Data to verify signature:', dataToSign);
    
    // Generate HMAC SHA256 signature
    const calculatedSignature = generateSignature(dataToSign, ESEWA_SECRET_KEY);
    
    console.log('Received signature:', signature);
    console.log('Calculated signature:', calculatedSignature);
    
    // Compare signatures
    return calculatedSignature === signature;
  } catch (error) {
    console.error('Error validating signature:', error);
    return false;
  }
}

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const url = new URL(request.url);
    const data = url.searchParams.get('data');
    
    console.log('Raw success response data:', data);
    
    if (!data) {
      console.error('No data received from eSewa');
      return NextResponse.redirect(`${url.origin}/dashboard/user/orders/failed?reason=no_data`);
    }
    
    // Decode the Base64 response
    let decodedData: string;
    let responseBody: any;
    
    try {
      decodedData = Buffer.from(data, 'base64').toString();
      responseBody = JSON.parse(decodedData);
      console.log('Decoded eSewa response:', responseBody);
    } catch (error) {
      console.error('Error decoding response:', error);
      return NextResponse.redirect(`${url.origin}/dashboard/user/orders/failed?reason=invalid_response`);
    }
    
    // Verify the signature if it exists
    if (responseBody.signature) {
      const isValid = validateSignature(responseBody, responseBody.signature);
      
      if (!isValid) {
        console.error('Invalid signature from eSewa');
        return NextResponse.redirect(`${url.origin}/dashboard/user/orders/failed?reason=invalid_signature`);
      }
    } else {
      console.warn('No signature in eSewa response');
    }
    
    const { transaction_uuid, status, total_amount, transaction_code } = responseBody;
    
    // Find payment by transaction UUID
    const payment = await prisma.payment.findFirst({
      where: { transactionId: transaction_uuid },
      include: { order: true }
    });
    
    if (!payment) {
      console.error('Payment not found for transaction:', transaction_uuid);
      return NextResponse.redirect(`${url.origin}/dashboard/user/orders/failed?reason=payment_not_found`);
    }
    
    console.log('Found payment record:', payment);
    
    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: status === 'COMPLETE' ? 'SUCCESS' : 'FAILED',
        transactionId: transaction_code || transaction_uuid, // Store the eSewa transaction code
      }
    });
    
    // Update order status
    if (payment.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: status === 'COMPLETE' ? 'PAID' : 'FAILED',
          paymentStatus: status === 'COMPLETE' ? 'SUCCESS' : 'FAILED',
        }
      });
    }
    
    // Redirect to success page if payment was successful
    if (status === 'COMPLETE') {
      // Build a redirect URL with order information for the client
      const redirectUrl = new URL(`${url.origin}/dashboard/user/orders/success`);
      redirectUrl.searchParams.append('order_id', payment.orderId || '');
      redirectUrl.searchParams.append('reference', transaction_code || '');
      
      return NextResponse.redirect(redirectUrl);
    } else {
      return NextResponse.redirect(`${url.origin}/dashboard/user/orders/failed?reason=payment_failed&status=${status}`);
    }
    
  } catch (error) {
    console.error('Error processing eSewa success callback:', error);
    const url = new URL(request.url);
    return NextResponse.redirect(`${url.origin}/dashboard/user/orders/failed?reason=server_error`);
  }
} 