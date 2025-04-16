import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { userId } = await  auth();
    const { searchParams } = new URL(request.url);
    
    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId as string },
    });
    
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || "";
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build where clause for filters
    const where: any = {};
    
    // Status filter
    if (status !== "ALL") {
      where.status = status;
    }
    
    // Search filter (search by order ID or user email/name)
    if (search) {
      where.OR = [
        {
          id: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          user: {
            OR: [
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ];
    }
    
    // Count total orders with filters
    const totalOrders = await prisma.order.count({ where });
    
    // Get orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: {
          select: {
            id: true,
            status: true,
            method: true,
            transactionId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / limit);
    
    return NextResponse.json({
      orders,
      totalOrders,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
} 