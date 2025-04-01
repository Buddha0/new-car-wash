"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Car, DollarSign, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
// import { AreaChart, BarChart as Chart } from "@/components/ui/chart"

export default function AdminDashboard() {
  // Sample data for charts
  const revenueData = [
    {
      name: "Jan",
      total: 1800,
    },
    {
      name: "Feb",
      total: 2200,
    },
    {
      name: "Mar",
      total: 2800,
    },
    {
      name: "Apr",
      total: 3300,
    },
    {
      name: "May",
      total: 4100,
    },
    {
      name: "Jun",
      total: 4800,
    },
  ]

  const serviceData = [
    {
      name: "Basic Wash",
      value: 350,
    },
    {
      name: "Premium Wash",
      value: 280,
    },
    {
      name: "Deluxe Wash",
      value: 190,
    },
    {
      name: "Interior Clean",
      value: 120,
    },
    {
      name: "Full Detail",
      value: 80,
    },
  ]

  return (
    <DashboardLayout userRole="admin">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$18,945</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">432</div>
                  <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245</div>
                  <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Services Completed</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">412</div>
                  <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>Revenue trends over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* <AreaChart
                    data={revenueData}
                    index="name"
                    categories={["total"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `$${value}`}
                    className="h-[300px]"
                  /> */}
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Service Demand</CardTitle>
                  <CardDescription>Distribution of services by popularity</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <Chart
                    data={serviceData}
                    index="name"
                    categories={["value"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${value} bookings`}
                    className="h-[300px]"
                  /> */}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Overview of the latest bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">James Wilson</TableCell>
                      <TableCell>Premium Wash</TableCell>
                      <TableCell>Today, 10:30 AM</TableCell>
                      <TableCell>Mike Johnson</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-500">In Progress</Badge>
                      </TableCell>
                      <TableCell className="text-right">$49.99</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Emily Brown</TableCell>
                      <TableCell>Full Detail</TableCell>
                      <TableCell>Today, 11:45 AM</TableCell>
                      <TableCell>Lisa Smith</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Completed</Badge>
                      </TableCell>
                      <TableCell className="text-right">$129.99</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Robert Davis</TableCell>
                      <TableCell>Basic Wash</TableCell>
                      <TableCell>Today, 1:15 PM</TableCell>
                      <TableCell>John Miller</TableCell>
                      <TableCell>
                        <Badge>Scheduled</Badge>
                      </TableCell>
                      <TableCell className="text-right">$24.99</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Sarah Johnson</TableCell>
                      <TableCell>Interior Clean</TableCell>
                      <TableCell>Today, 2:30 PM</TableCell>
                      <TableCell>Mike Johnson</TableCell>
                      <TableCell>
                        <Badge>Scheduled</Badge>
                      </TableCell>
                      <TableCell className="text-right">$39.99</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Michael Thompson</TableCell>
                      <TableCell>Deluxe Wash</TableCell>
                      <TableCell>Today, 3:45 PM</TableCell>
                      <TableCell>Lisa Smith</TableCell>
                      <TableCell>
                        <Badge>Scheduled</Badge>
                      </TableCell>
                      <TableCell className="text-right">$69.99</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Analytics Content</h2>
              <p>Detailed analytics would be displayed here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Reports Content</h2>
              <p>Detailed reports would be displayed here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

