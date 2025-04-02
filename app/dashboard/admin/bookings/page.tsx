"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// Import the Eye icon if it's not already imported
import { Check, Download, Edit, Plus, Search, X, Eye, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Sample booking data
const bookings = [
  {
    id: "B001",
    customer: {
      id: "C001",
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "555-123-4567",
    },
    service: "Premium Wash",
    vehicle: "BMW X5 (Black)",
    date: new Date(2023, 5, 20, 10, 30),
    status: "in-progress",
    price: 49.99,
    employee: {
      id: "E001",
      name: "Mike Johnson",
    },
    location: "Downtown Branch",
    notes: "Customer requested extra attention to wheels",
    paymentStatus: "paid",
    paymentMethod: "credit-card",
  },
  {
    id: "B002",
    customer: {
      id: "C002",
      name: "Emily Brown",
      email: "emily.brown@example.com",
      phone: "555-987-6543",
    },
    service: "Full Detail",
    vehicle: "Tesla Model 3 (White)",
    date: new Date(2023, 5, 20, 13, 15),
    status: "scheduled",
    price: 129.99,
    employee: {
      id: "E002",
      name: "Lisa Smith",
    },
    location: "Downtown Branch",
    notes: "",
    paymentStatus: "pending",
    paymentMethod: "pay-later",
  },
  {
    id: "B003",
    customer: {
      id: "C003",
      name: "Robert Davis",
      email: "robert.davis@example.com",
      phone: "555-456-7890",
    },
    service: "Basic Wash",
    vehicle: "Honda Civic (Blue)",
    date: new Date(2023, 5, 20, 15, 0),
    status: "scheduled",
    price: 24.99,
    employee: {
      id: "E003",
      name: "John Miller",
    },
    location: "Westside Branch",
    notes: "",
    paymentStatus: "pending",
    paymentMethod: "pay-later",
  },
  {
    id: "B004",
    customer: {
      id: "C004",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "555-789-0123",
    },
    service: "Interior Clean",
    vehicle: "Toyota Camry (Silver)",
    date: new Date(2023, 5, 21, 9, 0),
    status: "scheduled",
    price: 39.99,
    employee: {
      id: "E001",
      name: "Mike Johnson",
    },
    location: "Downtown Branch",
    notes: "",
    paymentStatus: "paid",
    paymentMethod: "credit-card",
  },
  {
    id: "B005",
    customer: {
      id: "C005",
      name: "Michael Thompson",
      email: "michael.thompson@example.com",
      phone: "555-321-6547",
    },
    service: "Deluxe Wash",
    vehicle: "Audi Q7 (Gray)",
    date: new Date(2023, 5, 21, 11, 30),
    status: "scheduled",
    price: 69.99,
    employee: {
      id: "E002",
      name: "Lisa Smith",
    },
    location: "Eastside Branch",
    notes: "",
    paymentStatus: "pending",
    paymentMethod: "pay-later",
  },
  {
    id: "B006",
    customer: {
      id: "C001",
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "555-123-4567",
    },
    service: "Basic Wash",
    vehicle: "BMW X5 (Black)",
    date: new Date(2023, 5, 19, 14, 0),
    status: "completed",
    price: 24.99,
    employee: {
      id: "E003",
      name: "John Miller",
    },
    location: "Downtown Branch",
    notes: "",
    paymentStatus: "paid",
    paymentMethod: "credit-card",
  },
  {
    id: "B007",
    customer: {
      id: "C003",
      name: "Robert Davis",
      email: "robert.davis@example.com",
      phone: "555-456-7890",
    },
    service: "Premium Wash",
    vehicle: "Honda Civic (Blue)",
    date: new Date(2023, 5, 18, 10, 30),
    status: "completed",
    price: 49.99,
    employee: {
      id: "E001",
      name: "Mike Johnson",
    },
    location: "Westside Branch",
    notes: "",
    paymentStatus: "paid",
    paymentMethod: "credit-card",
  },
  {
    id: "B008",
    customer: {
      id: "C002",
      name: "Emily Brown",
      email: "emily.brown@example.com",
      phone: "555-987-6543",
    },
    service: "Interior Clean",
    vehicle: "Tesla Model 3 (White)",
    date: new Date(2023, 5, 17, 15, 45),
    status: "completed",
    price: 39.99,
    employee: {
      id: "E002",
      name: "Lisa Smith",
    },
    location: "Downtown Branch",
    notes: "",
    paymentStatus: "paid",
    paymentMethod: "credit-card",
  },
]

// Sample employees for assignment
const employees = [
  { id: "E001", name: "Mike Johnson" },
  { id: "E002", name: "Lisa Smith" },
  { id: "E003", name: "John Miller" },
  { id: "E004", name: "Sarah Williams" },
  { id: "E005", name: "David Brown" },
]

// Sample locations
const locations = ["All Locations", "Downtown Branch", "Westside Branch", "Eastside Branch", "Northside Branch"]

// Sample services
const services = ["All Services", "Basic Wash", "Premium Wash", "Deluxe Wash", "Interior Clean", "Full Detail"]

export default function AdminBookings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<(typeof bookings)[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [filterLocation, setFilterLocation] = useState("All Locations")
  const [filterService, setFilterService] = useState("All Services")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [filterStatus, setFilterStatus] = useState("all")

  // Filter bookings based on search query and filters
  const filteredBookings = bookings.filter((booking) => {
    // Search query filter
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicle.toLowerCase().includes(searchQuery.toLowerCase())

    // Location filter
    const matchesLocation = filterLocation === "All Locations" || booking.location === filterLocation

    // Service filter
    const matchesService = filterService === "All Services" || booking.service === filterService

    // Date filter
    const matchesDate =
      !filterDate ||
      (booking.date.getDate() === filterDate.getDate() &&
        booking.date.getMonth() === filterDate.getMonth() &&
        booking.date.getFullYear() === filterDate.getFullYear())

    // Status filter
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && (booking.status === "scheduled" || booking.status === "in-progress")) ||
      (filterStatus === "completed" && booking.status === "completed") ||
      (filterStatus === "cancelled" && booking.status === "cancelled")

    return matchesSearch && matchesLocation && matchesService && matchesDate && matchesStatus
  })

  // Sort bookings by date (most recent first)
  const sortedBookings = [...filteredBookings].sort((a, b) => b.date.getTime() - a.date.getTime())

  const handleViewDetails = (booking: (typeof bookings)[0]) => {
    setSelectedBooking(booking)
  }

  const handleEditBooking = (booking: (typeof bookings)[0]) => {
    setSelectedBooking(booking)
    setIsEditDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "scheduled":
        return <Badge>Scheduled</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-500">In Progress</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "refunded":
        return <Badge variant="secondary">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const clearFilters = () => {
    setFilterLocation("All Locations")
    setFilterService("All Services")
    setFilterDate(undefined)
    setFilterStatus("all")
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Booking
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter bookings by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger id="location" className="w-full">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="service">Service</Label>
                  <Select value={filterService} onValueChange={setFilterService}>
                    <SelectTrigger id="service" className="w-full">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filterDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filterDate ? format(filterDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active (Scheduled & In Progress)</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by customer, email, or booking ID..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Button variant="ghost" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Manage all car wash bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedBookings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No bookings found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">No bookings match your search criteria.</p>
                  <Button className="mt-4" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{booking.customer.name}</div>
                            <div className="text-sm text-muted-foreground">{booking.customer.email}</div>
                          </TableCell>
                          <TableCell>
                            <div>{booking.service}</div>
                            <div className="text-sm text-muted-foreground">{booking.vehicle}</div>
                          </TableCell>
                          <TableCell>
                            <div>{format(booking.date, "MMM d, yyyy")}</div>
                            <div className="text-sm text-muted-foreground">{format(booking.date, "h:mm a")}</div>
                          </TableCell>
                          <TableCell>{booking.employee.name}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <div
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                onClick={() => handleViewDetails(booking)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
                              </div>
                              <div
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                onClick={() => handleEditBooking(booking)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </div>
                              {booking.status === "completed" && (
                                <div className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </div>
                              )}
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

        {/* Booking Details Dialog */}
        {selectedBooking && !isEditDialogOpen && (
          <Dialog open={!!selectedBooking && !isEditDialogOpen} onOpenChange={() => setSelectedBooking(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>Booking #{selectedBooking.id}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Customer Information</h3>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Name:</span> {selectedBooking.customer.name}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Email:</span> {selectedBooking.customer.email}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Phone:</span> {selectedBooking.customer.phone}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Booking Information</h3>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Service:</span> {selectedBooking.service}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Vehicle:</span> {selectedBooking.vehicle}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Date:</span> {format(selectedBooking.date, "MMMM d, yyyy")}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Time:</span> {format(selectedBooking.date, "h:mm a")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Assignment</h3>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Employee:</span> {selectedBooking.employee.name}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Location:</span> {selectedBooking.location}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Payment</h3>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Amount:</span> ${selectedBooking.price.toFixed(2)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Status:</span>{" "}
                        {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Method:</span>{" "}
                        {selectedBooking.paymentMethod === "credit-card" ? "Credit Card" : "Pay at Location"}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <div className="text-sm border rounded-md p-3 bg-muted/50">{selectedBooking.notes}</div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedBooking.status)}
                    <span className="text-sm text-muted-foreground">
                      Last updated: {format(new Date(), "MMM d, yyyy h:mm a")}
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => handleEditBooking(selectedBooking)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Booking
                </Button>
                {selectedBooking.status === "scheduled" && (
                  <Button>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as In Progress
                  </Button>
                )}
                {selectedBooking.status === "in-progress" && (
                  <Button>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
                {(selectedBooking.status === "scheduled" || selectedBooking.status === "in-progress") && (
                  <Button variant="destructive">
                    <X className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </Button>
                )}
                {selectedBooking.status === "completed" && (
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Booking Dialog */}
        {selectedBooking && isEditDialogOpen && (
          <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setSelectedBooking(null);
            }
          }}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Booking</DialogTitle>
                <DialogDescription>Update booking #{selectedBooking.id} details</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="assignment">Assignment</TabsTrigger>
                    <TabsTrigger value="status">Status</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-service">Service</Label>
                        <Select defaultValue={selectedBooking.service}>
                          <SelectTrigger id="edit-service" className="w-full">
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Basic Wash">Basic Wash</SelectItem>
                            <SelectItem value="Premium Wash">Premium Wash</SelectItem>
                            <SelectItem value="Deluxe Wash">Deluxe Wash</SelectItem>
                            <SelectItem value="Interior Clean">Interior Clean</SelectItem>
                            <SelectItem value="Full Detail">Full Detail</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="edit-vehicle">Vehicle</Label>
                        <Input id="edit-vehicle" defaultValue={selectedBooking.vehicle} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-date">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="edit-date"
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(selectedBooking.date, "PPP")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={selectedBooking.date} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="edit-time">Time</Label>
                        <Select defaultValue={format(selectedBooking.date, "HH:mm")}>
                          <SelectTrigger id="edit-time" className="w-full">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="09:30">9:30 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="10:30">10:30 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="11:30">11:30 AM</SelectItem>
                            <SelectItem value="12:00">12:00 PM</SelectItem>
                            <SelectItem value="12:30">12:30 PM</SelectItem>
                            <SelectItem value="13:00">1:00 PM</SelectItem>
                            <SelectItem value="13:30">1:30 PM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="14:30">2:30 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="15:30">3:30 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                            <SelectItem value="16:30">4:30 PM</SelectItem>
                            <SelectItem value="17:00">5:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="edit-notes">Notes</Label>
                      <Input id="edit-notes" defaultValue={selectedBooking.notes} />
                    </div>
                  </TabsContent>

                  <TabsContent value="assignment" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-employee">Assigned Employee</Label>
                        <Select defaultValue={selectedBooking.employee.id}>
                          <SelectTrigger id="edit-employee" className="w-full">
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="edit-location">Location</Label>
                        <Select defaultValue={selectedBooking.location}>
                          <SelectTrigger id="edit-location" className="w-full">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations
                              .filter((loc) => loc !== "All Locations")
                              .map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="status" className="space-y-4 mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-status">Booking Status</Label>
                      <Select defaultValue={selectedBooking.status}>
                        <SelectTrigger id="edit-status" className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="edit-payment-status">Payment Status</Label>
                      <Select defaultValue={selectedBooking.paymentStatus}>
                        <SelectTrigger id="edit-payment-status" className="w-full">
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}

