// app/dashboard/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Check,
  Download,
  Edit,
  Plus,
  Search,
  X,
  Eye,
  Package,
  ShoppingBag,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import Image from "next/image";

// Add this interface for Product
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

// Add this interface for Category
interface Category {
  id: string;
  name: string;
}

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterStock, setFilterStock] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching products data...");

        // Fetch products and categories
        const productsResponse = await fetch("/api/products");
        const categoriesResponse = await fetch("/api/categories");

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        console.log("Products data:", productsData);
        console.log("Categories data:", categoriesData);

        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load products data");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter products based on search query and filters
  const filteredProducts = products.filter((product) => {
    // Search query filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      filterCategory === "All Categories" ||
      product.category?.name === filterCategory;

    // Stock filter
    const matchesStock =
      filterStock === "all" ||
      (filterStock === "in-stock" && product.stock > 0) ||
      (filterStock === "low-stock" &&
        product.stock > 0 &&
        product.stock <= 10) ||
      (filterStock === "out-of-stock" && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sort products by creation date (most recent first)
  const sortedProducts = [...filteredProducts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsEditDialogOpen(true);
  };

  const handleCreateProduct = () => {
    // Create an empty product template
    const newProduct = {
      id: "",
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category:
        categories.length > 0
          ? {
              id: categories[0].id,
              name: categories[0].name,
            }
          : null,
      categoryId: categories.length > 0 ? categories[0].id : "",
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProductToEdit(newProduct);
    setIsCreateDialogOpen(true);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= 10) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        >
          Low Stock
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 hover:bg-green-100"
        >
          In Stock
        </Badge>
      );
    }
  };

  const clearFilters = () => {
    setFilterCategory("All Categories");
    setFilterStock("all");
    setSearchQuery("");
  };

  const handleSaveChanges = async () => {
    try {
      if (!productToEdit) return;
      setIsSaving(true);

      const productData = {
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        stock: productToEdit.stock,
        categoryId: productToEdit.categoryId,
        images: productToEdit.images,
      };

      let response;

      if (isCreateDialogOpen) {
        // Create new product
        response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
      } else {
        // Update existing product
        response = await fetch(`/api/products/${productToEdit.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      const updatedProduct = await response.json();

      // Update the products list with the new data
      if (isCreateDialogOpen) {
        // Ensure the category property exists in the returned product
        const enhancedProduct = {
          ...updatedProduct,
          category:
            categories.find((c) => c.id === updatedProduct.categoryId) || null,
        };

        setProducts((prevProducts) => [enhancedProduct, ...prevProducts]);
        toast.success("Product created successfully");
        setIsCreateDialogOpen(false);
      } else {
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (product.id === updatedProduct.id) {
              // Make sure to preserve the category information if it exists
              return {
                ...updatedProduct,
                category:
                  product.category ||
                  categories.find((c) => c.id === updatedProduct.categoryId) ||
                  null,
              };
            }
            return product;
          })
        );
        toast.success("Product updated successfully");
        setIsEditDialogOpen(false);
      }

      setProductToEdit(null);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setIsSaving(true);

      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Remove the product from the list
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );

      toast.success("Product deleted successfully");
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsSaving(false);
    }
  };

  // Form field handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductToEdit((prev) =>
      prev ? { ...prev, name: e.target.value } : null
    );
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setProductToEdit((prev) =>
      prev ? { ...prev, description: e.target.value } : null
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the raw input value
    const inputValue = e.target.value;

    // If the input is empty, set it as 0, otherwise parse it
    const priceValue = inputValue === "" ? 0 : parseFloat(inputValue);

    setProductToEdit((prev) =>
      prev ? { ...prev, price: isNaN(priceValue) ? 0 : priceValue } : null
    );
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the raw input value
    const inputValue = e.target.value;

    // If the input is empty, set it as 0, otherwise parse it
    const stockValue = inputValue === "" ? 0 : parseInt(inputValue);

    setProductToEdit((prev) =>
      prev ? { ...prev, stock: isNaN(stockValue) ? 0 : stockValue } : null
    );
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((c) => c.id === value);
    setProductToEdit((prev) =>
      prev
        ? {
            ...prev,
            categoryId: value,
            category: selectedCategory
              ? {
                  id: value,
                  name: selectedCategory.name,
                }
              : null,
          }
        : null
    );
  };

  const handleImagesChange = (url: string) => {
    setProductToEdit((prev) =>
      prev
        ? {
            ...prev,
            images: [...prev.images, url],
          }
        : null
    );
  };

  const handleImageRemove = (url: string) => {
    setProductToEdit((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.filter((image) => image !== url),
          }
        : null
    );
  };

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      {/* Fixed position container to prevent page-level scrolling */}
      <div className="fixed inset-0 pt-16 xl:pl-[220px]">
        <div className="flex flex-col h-full overflow-hidden p-4 md:p-6">
          {/* Header section with title and add button - not scrollable */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <Button onClick={handleCreateProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>

          {/* Content area - scrollable */}
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col gap-4">
              {/* Filters card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Filters</CardTitle>
                  <CardDescription>
                    Filter products by various criteria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={filterCategory}
                        onValueChange={setFilterCategory}
                      >
                        <SelectTrigger id="category" className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Categories">
                            All Categories
                          </SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="stock">Stock Status</Label>
                      <Select
                        value={filterStock}
                        onValueChange={setFilterStock}
                      >
                        <SelectTrigger id="stock" className="w-full">
                          <SelectValue placeholder="Select stock status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stock Levels</SelectItem>
                          <SelectItem value="in-stock">In Stock</SelectItem>
                          <SelectItem value="low-stock">Low Stock</SelectItem>
                          <SelectItem value="out-of-stock">
                            Out of Stock
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative flex-1">
                      <Label htmlFor="search">Search</Label>
                      <div className="relative mt-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          type="search"
                          placeholder="Search by name, description, or ID..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="ghost" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Products list card */}
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>All Products</CardTitle>
                  <CardDescription>
                    Manage your product inventory
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {sortedProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">
                        No products found
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        No products match your search criteria.
                      </p>
                      <Button className="mt-4" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-card z-10">
                          <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="relative h-10 w-10">
                                  {product.images &&
                                  product.images.length > 0 ? (
                                    <Image
                                      src={
                                        product.images[0] || "/placeholder.svg"
                                      }
                                      alt={product.name}
                                      fill
                                      className="object-cover rounded-md"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {product.name}
                                </div>
                                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {product.description || "No description"}
                                </div>
                              </TableCell>
                              <TableCell>
                                {product.category?.name || "Uncategorized"}
                              </TableCell>
                              <TableCell>
                                {formatPrice(product.price)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span>{product.stock}</span>
                                  {getStockBadge(product.stock)}
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  product.updatedAt
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <div
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                    onClick={() => handleViewDetails(product)}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">
                                      View Details
                                    </span>
                                  </div>
                                  <div
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Dialog */}
      {selectedProduct && (
        <Dialog
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
              <DialogDescription>
                Product #{selectedProduct.id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Product Information</h3>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {selectedProduct.name}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Category:</span>{" "}
                      {selectedProduct.category?.name || "Uncategorized"}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Price:</span>{" "}
                      {formatPrice(selectedProduct.price)}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Stock:</span>{" "}
                      {selectedProduct.stock} units
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Dates</h3>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(selectedProduct.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Last Updated:</span>{" "}
                      {new Date(selectedProduct.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {selectedProduct.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <div className="text-sm border rounded-md p-3 bg-muted/50">
                    {selectedProduct.description}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Images</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.images &&
                  selectedProduct.images.length > 0 ? (
                    selectedProduct.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-24 w-24 rounded-md overflow-hidden"
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${selectedProduct.name} image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No images available
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => handleEditProduct(selectedProduct)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteProduct(selectedProduct.id)}
              >
                <X className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit/Create Product Dialog */}
      {productToEdit && (isEditDialogOpen || isCreateDialogOpen) && (
        <Dialog
          open={isEditDialogOpen || isCreateDialogOpen}
          onOpenChange={(open) => {
            if (isEditDialogOpen) setIsEditDialogOpen(open);
            if (isCreateDialogOpen) setIsCreateDialogOpen(open);
            if (!open) setProductToEdit(null);
          }}
        >
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isCreateDialogOpen ? "Create Product" : "Edit Product"}
              </DialogTitle>
              <DialogDescription>
                {isCreateDialogOpen
                  ? "Add a new product to your inventory"
                  : `Update product #${productToEdit.id}`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Basic Details</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Product Name</Label>
                    <Input
                      id="edit-name"
                      value={productToEdit.name}
                      onChange={handleNameChange}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={productToEdit.description || ""}
                      onChange={handleDescriptionChange}
                      placeholder="Enter product description"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-price">Price</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        value={
                          productToEdit.price === 0 ? "" : productToEdit.price
                        }
                        onChange={handlePriceChange}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="edit-stock">Stock</Label>
                      <Input
                        id="edit-stock"
                        type="number"
                        value={
                          productToEdit.stock === 0 ? "" : productToEdit.stock
                        }
                        onChange={handleStockChange}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      value={productToEdit.categoryId}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger id="edit-category" className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label>Product Images</Label>
                    <ImageUpload
                      value={productToEdit.images}
                      onChange={handleImagesChange}
                      onRemove={handleImageRemove}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  if (isEditDialogOpen) setIsEditDialogOpen(false);
                  if (isCreateDialogOpen) setIsCreateDialogOpen(false);
                  setProductToEdit(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </div>
                ) : isCreateDialogOpen ? (
                  "Create Product"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
