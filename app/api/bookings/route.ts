import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/lib/auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { stylistId, serviceId, date, time } = await request.json()
    const booking = await prisma.booking.create({
      data: {
        date: new Date(date),
        time,
        userId: session.user.id,
        stylistId: Number.parseInt(stylistId),
        serviceId: Number.parseInt(serviceId),
      },
    })
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Error creating booking" }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { stylist: true, service: true },
    })
    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Error fetching bookings" }, { status: 500 })
  }
}

