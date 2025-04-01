"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Car, Clock, Download, FileText, Filter, Pencil, Search, X } from "lucide-react"
import { format } from "date-fns"

// Sample booking data
const bookings = [
  {
    id: "B001",
    service: "Deluxe Wash",
    vehicle: "Tesla Model 3",
    date: new Date(2023, 4, 15, 14, 30),
    status: "completed",
    price: 69.99,
    employee: "Mike Johnson",
    location: "Downtown Branch",
    notes: "Customer requested extra attention to wheels",
    receipt: "INV-2023-05-15-001",
  },
  {
    id: "B002",
    service: "Interior Clean",
    vehicle: "Tesla Model 3",
    date: new Date(2023, 3, 28, 10, 0),
    status: "completed",
    price: 39.99,
    employee: "Lisa Smith",
    location: "Downtown Branch",
    notes: "",
    receipt: "INV-2023-04-28-003",
  },
  {
    id: "B003",
    service: "Premium Wash",
    vehicle: "Honda Accord",
    date: new Date(2023, 3, 10, 15, 30),
    status: "completed",
    price: 49.99,
    employee: "John Miller",
    location: "Westside Branch",
    notes: "",
    receipt: "INV-2023-04-10-007",
  },
  {
    id: "B004",
    service: "Full Detail",
    vehicle: "Tesla Model 3",
    date: new Date(2023, 5, 5, 13, 0),
    status: "scheduled",
    price: 129.99,
    employee: "Lisa Smith",
    location: "Downtown Branch",
    notes: "New car preparation",
    receipt: "",
  },
  {
    id: "B005",
    service: "Basic Wash",
    vehicle: "Honda Accord",
    date: new Date(2023, 5, 12, 11, 30),
    status: "scheduled",
    price: 24.99,
    employee: "To be assigned",
    location: "Westside Branch",
    notes: "",
    receipt: "",
  },
]

export default function BookingHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<(typeof bookings)[0] | null>(null)

  const upcomingBookings = bookings
    .filter((booking) => booking.status === "scheduled" && booking.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const pastBookings = bookings
    .filter(
      (booking) => booking.status === "completed" || (booking.status === "scheduled" && booking.date <= new Date()),
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const filteredUpcomingBookings = upcomingBookings.filter(
    (booking) =>
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPastBookings = pastBookings.filter(
    (booking) =>
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewDetails = (booking: (typeof bookings)[0]) => {
    setSelectedBooking(booking)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "scheduled":
        return <Badge>Scheduled</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <DashboardLayout userRole="user">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <Button asChild>
            <a href="/dashboard/user/book">
              <Calendar className="mr-2 h-4 w-4" />
              Book New Service
            </a>
          </Button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookings..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled car wash appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredUpcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No upcoming bookings</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchQuery
                        ? "No bookings match your search criteria."
                        : "You don't have any upcoming car wash appointments."}
                    </p>
                    {!searchQuery && (
                      <Button className="mt-4" asChild>
                        <a href="/dashboard/user/book">Book a Service</a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUpcomingBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.service}</TableCell>
                            <TableCell>{booking.vehicle}</TableCell>
                            <TableCell>{format(booking.date, "MMM d, yyyy h:mm a")}</TableCell>
                            <TableCell>{booking.location}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleViewDetails(booking)}>
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only">View Details</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Cancel</span>
                                </Button>
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
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Past Bookings</CardTitle>
                <CardDescription>Your booking history</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPastBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No past bookings</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchQuery
                        ? "No bookings match your search criteria."
                        : "You don't have any past car wash appointments."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPastBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.service}</TableCell>
                            <TableCell>{booking.vehicle}</TableCell>
                            <TableCell>{format(booking.date, "MMM d, yyyy h:mm a")}</TableCell>
                            <TableCell>{booking.location}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleViewDetails(booking)}>
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only">View Details</span>
                                </Button>
                                {booking.receipt && (
                                  <Button variant="ghost" size="icon">
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">Download Receipt</span>
                                  </Button>
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
          </TabsContent>
        </Tabs>

        {/* Booking Details Dialog */}
        {selectedBooking && (
          <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>Booking #{selectedBooking.id}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Service</Label>
                  <div className="col-span-3 font-medium">{selectedBooking.service}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Vehicle</Label>
                  <div className="col-span-3">{selectedBooking.vehicle}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Date & Time</Label>
                  <div className="col-span-3">{format(selectedBooking.date, "MMMM d, yyyy h:mm a")}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Location</Label>
                  <div className="col-span-3">{selectedBooking.location}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <div className="col-span-3">{getStatusBadge(selectedBooking.status)}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Price</Label>
                  <div className="col-span-3">${selectedBooking.price.toFixed(2)}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Employee</Label>
                  <div className="col-span-3">{selectedBooking.employee}</div>
                </div>
                {selectedBooking.notes && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Notes</Label>
                    <div className="col-span-3">{selectedBooking.notes}</div>
                  </div>
                )}
                {selectedBooking.receipt && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Receipt</Label>
                    <div className="col-span-3">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        {selectedBooking.receipt}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {selectedBooking.status === "scheduled" && (
                  <>
                    <Button variant="outline" className="sm:w-auto w-full">
                      <Pencil className="mr-2 h-4 w-4" />
                      Reschedule
                    </Button>
                    <Button variant="destructive" className="sm:w-auto w-full">
                      <X className="mr-2 h-4 w-4" />
                      Cancel Booking
                    </Button>
                  </>
                )}
                {selectedBooking.status === "completed" && (
                  <Button className="sm:w-auto w-full">
                    <Car className="mr-2 h-4 w-4" />
                    Book Again
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}

