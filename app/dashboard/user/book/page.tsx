"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, ChevronRight, Clock, CreditCard, Info } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
]

const services = [
  {
    id: "basic-wash",
    name: "Basic Wash",
    price: 24.99,
    duration: "30 min",
    description: "Exterior wash, wheel cleaning, and basic drying.",
    features: ["Exterior Wash", "Wheel Cleaning", "Basic Drying"],
  },
  {
    id: "premium-wash",
    name: "Premium Wash",
    price: 49.99,
    duration: "45 min",
    description: "Everything in Basic Wash plus waxing, tire shine, and interior vacuum.",
    features: ["Exterior Wash", "Wheel Cleaning", "Waxing", "Tire Shine", "Interior Vacuum"],
  },
  {
    id: "deluxe-wash",
    name: "Deluxe Wash",
    price: 69.99,
    duration: "60 min",
    description: "Our most comprehensive wash with premium wax, interior cleaning, and dashboard conditioning.",
    features: [
      "Premium Exterior Wash",
      "Wheel Detailing",
      "Premium Waxing",
      "Tire Shine",
      "Full Interior Vacuum",
      "Dashboard Conditioning",
      "Window Cleaning",
    ],
  },
  {
    id: "interior-clean",
    name: "Interior Clean",
    price: 39.99,
    duration: "45 min",
    description: "Thorough interior cleaning including vacuum, surfaces, and windows.",
    features: [
      "Full Interior Vacuum",
      "Dashboard Conditioning",
      "Door Panel Cleaning",
      "Window Cleaning",
      "Seat Cleaning",
    ],
  },
  {
    id: "full-detail",
    name: "Full Detail",
    price: 129.99,
    duration: "120 min",
    description: "Complete interior and exterior detailing for the ultimate clean.",
    features: [
      "Premium Exterior Wash",
      "Clay Bar Treatment",
      "Premium Waxing",
      "Wheel Detailing",
      "Tire Shine",
      "Full Interior Vacuum",
      "Upholstery Shampooing",
      "Leather Conditioning",
      "Dashboard & Trim Detailing",
      "Window Cleaning",
    ],
  },
]

const vehicles = [
  { id: "v1", name: "Tesla Model 3", color: "White", license: "ABC123" },
  { id: "v2", name: "Honda Accord", color: "Black", license: "XYZ789" },
]

export default function BookService() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeSlot, setTimeSlot] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string>("premium-wash")
  const [selectedVehicle, setSelectedVehicle] = useState<string>("v1")
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<string>("saved-card")

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    // In a real app, this would submit the booking to the server
    alert("Booking confirmed! You will receive a confirmation email shortly.")
    // Redirect to dashboard or booking confirmation page
  }

  const selectedServiceDetails = services.find((service) => service.id === selectedService)
  const selectedVehicleDetails = vehicles.find((vehicle) => vehicle.id === selectedVehicle)

  return (
    <DashboardLayout userRole="user">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Book a Car Wash</h1>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border",
                currentStep >= 1
                  ? "bg-primary text-primary-foreground"
                  : "border-muted-foreground text-muted-foreground",
              )}
            >
              1
            </div>
            <div className={cn("mx-2 h-1 w-16 bg-muted", currentStep >= 2 ? "bg-primary" : "bg-muted")} />
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border",
                currentStep >= 2
                  ? "bg-primary text-primary-foreground"
                  : "border-muted-foreground text-muted-foreground",
              )}
            >
              2
            </div>
            <div className={cn("mx-2 h-1 w-16 bg-muted", currentStep >= 3 ? "bg-primary" : "bg-muted")} />
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border",
                currentStep >= 3
                  ? "bg-primary text-primary-foreground"
                  : "border-muted-foreground text-muted-foreground",
              )}
            >
              3
            </div>
          </div>

          {currentStep === 1 && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Select a Service</CardTitle>
                  <CardDescription>Choose the type of car wash service you need</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedService}
                    onValueChange={setSelectedService}
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                  >
                    {services.map((service) => (
                      <div key={service.id}>
                        <RadioGroupItem value={service.id} id={service.id} className="peer sr-only" />
                        <Label
                          htmlFor={service.id}
                          className="flex flex-col gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="flex justify-between">
                            <span className="text-base font-semibold">{service.name}</span>
                            <span className="text-base font-semibold">${service.price}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{service.duration}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <ul className="mt-2 text-sm grid gap-1">
                            {service.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select a Vehicle</CardTitle>
                  <CardDescription>Choose which vehicle you want serviced</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedVehicle} onValueChange={setSelectedVehicle} className="grid gap-4">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id}>
                        <RadioGroupItem value={vehicle.id} id={vehicle.id} className="peer sr-only" />
                        <Label
                          htmlFor={vehicle.id}
                          className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div>
                            <div className="font-semibold">{vehicle.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {vehicle.color} • License: {vehicle.license}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button variant="outline" className="mt-4 w-full">
                    Add a New Vehicle
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                  <CardDescription>Any special instructions for your service</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="E.g., Please pay extra attention to the stain on the passenger seat"
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select a Date</CardTitle>
                  <CardDescription>Choose your preferred service date</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => {
                      // Disable past dates and Sundays
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today || date.getDay() === 0
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select a Time</CardTitle>
                  <CardDescription>
                    Available time slots for {date ? format(date, "EEEE, MMMM do") : "selected date"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={timeSlot === time ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setTimeSlot(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Select how you would like to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-4">
                    <div>
                      <RadioGroupItem value="saved-card" id="saved-card" className="peer sr-only" />
                      <Label
                        htmlFor="saved-card"
                        className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-semibold">Saved Card</div>
                            <div className="text-sm text-muted-foreground">Visa ending in 4242</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="new-card" id="new-card" className="peer sr-only" />
                      <Label
                        htmlFor="new-card"
                        className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-semibold">New Card</div>
                            <div className="text-sm text-muted-foreground">Add a new credit or debit card</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="pay-later" id="pay-later" className="peer sr-only" />
                      <Label
                        htmlFor="pay-later"
                        className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-semibold">Pay at Location</div>
                            <div className="text-sm text-muted-foreground">Pay with card or cash when you arrive</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "new-card" && (
                    <div className="mt-4 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name on Card</Label>
                        <Input id="name" placeholder="John Smith" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                  <CardDescription>Review your booking details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <h3 className="font-semibold">Service</h3>
                    <div className="mt-1 flex justify-between">
                      <span>{selectedServiceDetails?.name}</span>
                      <span>${selectedServiceDetails?.price}</span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Duration: {selectedServiceDetails?.duration}
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <h3 className="font-semibold">Vehicle</h3>
                    <div className="mt-1">{selectedVehicleDetails?.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {selectedVehicleDetails?.color} • License: {selectedVehicleDetails?.license}
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <h3 className="font-semibold">Date & Time</h3>
                    <div className="mt-1">{date ? format(date, "EEEE, MMMM do, yyyy") : "No date selected"}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{timeSlot || "No time selected"}</div>
                  </div>

                  <div className="rounded-lg border p-3 bg-muted/50">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${selectedServiceDetails?.price}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Tax</span>
                      <span>${(selectedServiceDetails?.price || 0) * 0.08}</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                      <span>Total</span>
                      <span>${((selectedServiceDetails?.price || 0) * 1.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground">
                      You can cancel or reschedule your appointment up to 2 hours before your scheduled time without any
                      charges.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handlePreviousStep}>
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < 3 ? (
              <Button onClick={handleNextStep}>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>Confirm Booking</Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

