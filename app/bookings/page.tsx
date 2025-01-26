"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon } from "lucide-react"

export default function Bookings() {
  const { data: session } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [newDate, setNewDate] = useState(null)
  const [newTime, setNewTime] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/login")
    } else {
      fetchBookings()
    }
  }, [session, router])

  const fetchBookings = () => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
  }

  const handleCancel = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchBookings()
      } else {
        throw new Error("Failed to cancel booking")
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      alert("Failed to cancel booking. Please try again.")
    }
  }

  const handleReschedule = async () => {
    if (!selectedBooking || !newDate || !newTime) return

    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, time: newTime }),
      })
      if (response.ok) {
        fetchBookings()
        setIsRescheduling(false)
      } else {
        throw new Error("Failed to reschedule booking")
      }
    } catch (error) {
      console.error("Error rescheduling booking:", error)
      alert("Failed to reschedule booking. Please try again.")
    }
  }

  const handleReviewSubmit = async (bookingId) => {
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, bookingId }),
      })
      if (response.ok) {
        fetchBookings()
        setRating(0)
        setComment("")
      } else {
        throw new Error("Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review. Please try again.")
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Ihre Buchungen</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle>{booking.stylist.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Service: {booking.service.name}</p>
              <p>Datum: {new Date(booking.date).toLocaleDateString()}</p>
              <p>Uhrzeit: {booking.time}</p>
              <p>Preis: €{booking.service.price}</p>
              <div className="mt-4 space-x-2">
                <Button onClick={() => handleCancel(booking.id)} variant="destructive">
                  Stornieren
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedBooking(booking)
                        setIsRescheduling(true)
                      }}
                    >
                      Umbuchen
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Termin umbuchen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Calendar mode="single" selected={newDate} onSelect={setNewDate} className="rounded-md border" />
                      <Select value={newTime} onValueChange={setNewTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen Sie eine Uhrzeit" />
                        </SelectTrigger>
                        <SelectContent>
                          {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleReschedule}>Termin umbuchen</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                {!booking.review && new Date(booking.date) < new Date() && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Bewertung abgeben</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Bewerten Sie Ihren Termin</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`w-6 h-6 cursor-pointer ${
                                star <= rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                              onClick={() => setRating(star)}
                            />
                          ))}
                        </div>
                        <Textarea
                          placeholder="Ihr Kommentar"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <Button onClick={() => handleReviewSubmit(booking.id)}>Bewertung abschicken</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

