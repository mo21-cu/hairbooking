import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const stylists = await prisma.stylist.findMany({
      include: { services: true },
    })
    return NextResponse.json(stylists)
  } catch (error) {
    console.error("Error fetching stylists:", error)
    return NextResponse.json({ error: "Error fetching stylists" }, { status: 500 })
  }
}

