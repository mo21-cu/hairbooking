import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function GET() {
  try {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: new Date(),
          lt: tomorrow,
        },
        status: "confirmed",
      },
      include: {
        user: true,
        stylist: true,
        service: true,
      },
    })

    for (const booking of bookings) {
      await transporter.sendMail({
        from: '"MSSC Bookings" <noreply@msscbookings.com>',
        to: booking.user.email,
        subject: "Reminder: Your upcoming appointment",
        text: `
          Dear ${booking.user.name},

          This is a reminder for your upcoming appointment:

          Stylist: ${booking.stylist.name}
          Service: ${booking.service.name}
          Date: ${booking.date.toLocaleDateString()}
          Time: ${booking.time}

          We look forward to seeing you!

          Best regards,
          MSSC Bookings Team
        `,
      })
    }

    return NextResponse.json({ message: "Notifications sent successfully" })
  } catch (error) {
    console.error("Error sending notifications:", error)
    return NextResponse.json({ error: "Error sending notifications" }, { status: 500 })
  }
}

