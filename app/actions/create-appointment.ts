"use server"

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { appendOffsetOfLegend } from "recharts/types/util/ChartUtils";

interface CreateAppointmentParams {
  serviceId: string;
  vehicleId: string;
  date: Date;
  timeSlot: string;
  notes?: string;
  paymentMethod: string;
  amount?: number; // Optional if you calculate on server
}
export default async function CreateAppointment(appointmnetDetails: CreateAppointmentParams) {
  try {

    console.log("yeasdjknaks hoo ", appointmnetDetails)

    const { userId } = await auth();


    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    
    if (!user) {
      throw new Error('User not found');
    }

    const data =  appointmnetDetails;


    // Validate required fields
    if (!data.serviceId || !data.vehicleId || !data.date || !data.timeSlot) {
      return Response.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        serviceId: data.serviceId,
        vehicleId: data.vehicleId,
        date: new Date(data.date),
        timeSlot: data.timeSlot,
        status: "PENDING", // Default status from the model
        notes: data.notes || "",
      },
    });

   

    return appointment;
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return Response.json({ message: "Failed to create appointment" }, { status: 500 });
  }
}