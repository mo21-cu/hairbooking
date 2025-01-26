import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const stylist = await prisma.stylist.findUnique({
      where: { id: session.user.id },
      include: { services: true },
    })

    if (!stylist) {
      return NextResponse.json({ error: "Stylist not found" }, { status: 404 })
    }

    return NextResponse.json({ stylist, services: stylist.services })
  } catch (error) {
    console.error("Error fetching stylist data:", error)
    return NextResponse.json({ error: "Error fetching stylist data" }, { status: 500 })
  }
}

