"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Search, Filter, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: {
    id: string;
    name: string;
  } | null;
  categoryId: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
}

export default function UserProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const { addItem, items } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products and categories
        const productsResponse = await fetch("/api/products");
        const categoriesResponse = await fetch("/api/categories");

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;

    const matchesCategory =
      selectedCategory === "all" || product.category?.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  if (loading) {
    return (
      <DashboardLayout userRole="user">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="user">
      {/* Container with fixed position and height */}
      <div className="fixed inset-0 pt-16 xl:pl-[220px]">
        {" "}
        {/* Adjust for header height and sidebar width */}
        <div className="flex flex-col h-full overflow-hidden p-4 md:p-6">
          {/* Header section with title and cart button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Shop Products
              </h1>
              <p className="text-muted-foreground">
                Browse our selection of premium car care products
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="relative" asChild>
                <Link href="/dashboard/user/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {items.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -right-2 -top-2 px-1 min-w-5 h-5 flex items-center justify-center"
                    >
                      {items.reduce((total, item) => total + item.quantity, 0)}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>
          </div>

          {/* Main grid layout - fixed height with overflow */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 flex-1 overflow-hidden">
            {/* Filters sidebar - fixed height with its own scrollbar */}
            <Card className="h-full overflow-auto">
              <CardHeader className="sticky top-0 bg-card z-10 pb-3">
                <CardTitle className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Categories</h3>
                  <div className="space-y-1">
                    <div
                      className={`px-2 py-1 rounded-md cursor-pointer hover:bg-accent ${
                        selectedCategory === "all" ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedCategory("all")}
                    >
                      All Products
                    </div>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`px-2 py-1 rounded-md cursor-pointer hover:bg-accent ${
                          selectedCategory === category.id ? "bg-accent" : ""
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sort By</h3>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">View</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      List
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products section - with search bar (sticky) and scrollable content */}
            <div className="flex flex-col h-full overflow-hidden">
              {/* Search bar area - sticky at top */}
              <div className="sticky top-0 z-10 bg-background pb-3 flex flex-col sm:flex-row sm:items-center gap-4 mb-1">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  Showing {sortedProducts.length} of {products.length} products
                </div>
              </div>

              {/* Scrollable products container */}
              <div className="overflow-y-auto flex-1 pr-1">
                {sortedProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      No products found
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try adjusting your search or filter to find what you're
                      looking for.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                    >
                      Reset filters
                    </Button>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden flex flex-col h-full"
                      >
                        <div className="relative aspect-square">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {product.stock <= 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Badge variant="destructive" className="text-xs">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardHeader className="p-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-sm line-clamp-1">
                                {product.name}
                              </CardTitle>
                              <CardDescription className="text-xs line-clamp-1">
                                {product.description ||
                                  "No description available"}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {product.category?.name || "Uncategorized"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardFooter className="p-2 pt-0 mt-auto flex justify-between items-center">
                          <div className="font-semibold">
                            {formatPrice(product.price)}
                          </div>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={
                              product.stock <= 0 || isInCart(product.id)
                            }
                            size="sm"
                            className="h-8 px-2 text-xs"
                          >
                            {isInCart(product.id) ? (
                              <>Added</>
                            ) : (
                              <>
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Add
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sortedProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-28 h-28">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                            {product.stock <= 0 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Out of Stock
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-3 flex flex-col">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-sm font-bold line-clamp-1">
                                  {product.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="mt-1 text-xs"
                                >
                                  {product.category?.name || "Uncategorized"}
                                </Badge>
                              </div>
                              <div className="font-semibold">
                                {formatPrice(product.price)}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {product.description ||
                                "No description available"}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-xs text-muted-foreground">
                                {product.stock > 0
                                  ? `${product.stock} in stock`
                                  : "Out of stock"}
                              </div>
                              <Button
                                onClick={() => handleAddToCart(product)}
                                disabled={
                                  product.stock <= 0 || isInCart(product.id)
                                }
                                size="sm"
                                className="h-8 px-2 text-xs"
                              >
                                {isInCart(product.id) ? (
                                  <>Added</>
                                ) : (
                                  <>
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                    Add to Cart
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
