import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, price, duration } = await request.json()

  try {
    const service = await prisma.service.create({
      data: {
        name,
        price: Number.parseFloat(price),
        duration: Number.parseInt(duration),
        stylistId: session.user.id,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Error creating service" }, { status: 500 })
  }
}

