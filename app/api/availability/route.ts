import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const stylistId = searchParams.get("stylistId")
  const date = searchParams.get("date")

  if (!stylistId || !date) {
    return NextResponse.json({ error: "Missing stylistId or date" }, { status: 400 })
  }

  const bookings = await prisma.booking.findMany({
    where: {
      stylistId: Number.parseInt(stylistId),
      date: new Date(date),
    },
    select: {
      time: true,
    },
  })

  const bookedTimes = bookings.map((booking) => booking.time)

  const availableTimes = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ].filter((time) => !bookedTimes.includes(time))

  return NextResponse.json({ availableTimes })
}

