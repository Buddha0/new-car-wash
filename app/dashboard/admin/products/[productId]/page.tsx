// app/dashboard/admin/products/[productId]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import db from "@/lib/db";

import { ProductForm } from "./product-form";

export const metadata: Metadata = {
  title: "Edit Product | Admin Dashboard",
  description: "Edit your product details",
};

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // For new product
  if (params.productId === "new") {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductForm initialData={null} categories={categories} />
        </div>
      </div>
    );
  }

  // For existing product
  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} categories={categories} />
      </div>
    </div>
  );
}
