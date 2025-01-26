import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  // Configure your email service here
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request: Request) {
  const { to, subject, text } = await request.json()

  try {
    await transporter.sendMail({
      from: '"MSSC Bookings" <bookings@msscbarbers.com>',
      to,
      subject,
      text,
    })

    return NextResponse.json({ message: "Email sent successfully" })
  } catch (error) {
    console.error("Failed to send email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

