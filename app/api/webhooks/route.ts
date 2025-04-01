import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

// Initialize Prisma client
const prisma = new PrismaClient()

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Get the event type
  const eventType = evt.type
  console.log(`Received webhook with event type of ${eventType}`)
  
  // Handle user creation event
  if (eventType === 'user.created') {
    try {
      // Extract user data from the webhook payload
      const { id: clerkUserId, email_addresses, first_name, last_name, phone_numbers } = evt.data
      
      // Get the primary email
      const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id)?.email_address
      
      // Get phone number if available
      const phoneNumber = phone_numbers && phone_numbers.length > 0 ? phone_numbers[0].phone_number : null
      
      // Prepare user name
      const fullName = first_name && last_name 
        ? `${first_name} ${last_name}` 
        : first_name || (primaryEmail ? primaryEmail.split('@')[0] : 'User')
      
      // Create user in Prisma database
      const newUser = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
          name: fullName,
          email: primaryEmail || '',
          phone: phoneNumber,
       
        },
      })
      
      console.log('User created in database:', newUser)
    } catch (error) {
      console.error('Error creating user in database:', error)
    }
  }

  return new Response('Webhook received', { status: 200 })
}