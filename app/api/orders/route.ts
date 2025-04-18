import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the database user that corresponds to the Clerk user
    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database. Please complete your profile first.' },
        { status: 404 }
      );
    }

    const { items, totalAmount } = await request.json();

    if (!items || !items.length || !totalAmount) {
      return NextResponse.json(
        { error: 'Items and total amount are required' },
        { status: 400 }
      );
    }

    // Verify that all products exist and have correct prices
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      }
    });

    // Make sure all products were found
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products not found' },
        { status: 404 }
      );
    }

    // Create the order using the database user ID, not the Clerk ID
    const order = await prisma.order.create({
      data: {
        userId: user.id, // Use the database user ID, not the clerkId
        totalAmount: totalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'ESEWA',
        items: {
          create: items.map((item: any) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          }
        }
      }
    });

    // Update product stock quantities
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: product.stock - item.quantity,
          }
        });
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 