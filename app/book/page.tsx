"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BookAppointment() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialStylistId = searchParams.get("stylist")

  const [stylists, setStylists] = useState([])
  const [selectedStylist, setSelectedStylist] = useState(initialStylistId || "")
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  useEffect(() => {
    fetch("/api/stylists")
      .then((res) => res.json())
      .then((data) => setStylists(data))
  }, [])

  useEffect(() => {
    if (selectedStylist && selectedDate) {
      fetch(`/api/availability?stylistId=${selectedStylist}&date=${selectedDate.toISOString().split("T")[0]}`)
        .then((res) => res.json())
        .then((data) => setAvailableTimes(data.availableTimes))
    }
  }, [selectedStylist, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      router.push("/login")
      return
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stylistId: selectedStylist,
          serviceId: selectedService,
          date: selectedDate,
          time: selectedTime,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      alert("BUCHUNG ERFOLGREICH!")
      router.push("/bookings")
    } catch (error) {
      console.error("Error during booking:", error)
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Buchen Sie Ihren Termin</h1>
      <Card className="max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Details zu Ihrem Termin</CardTitle>
            <CardDescription>Bitte wählen Sie einen Barber, Service, Tag und Uhrzeit aus.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="stylist" className="block text-sm font-medium text-gray-700 mb-1">
                Barber
              </label>
              <Select value={selectedStylist} onValueChange={setSelectedStylist}>
                <SelectTrigger id="stylist">
                  <SelectValue placeholder="Wählen Sie einen Barber" />
                </SelectTrigger>
                <SelectContent>
                  {stylists.map((stylist) => (
                    <SelectItem key={stylist.id} value={stylist.id.toString()}>
                      {stylist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Wählen Sie einen Service" />
                </SelectTrigger>
                <SelectContent>
                  {stylists
                    .find((s) => s.id.toString() === selectedStylist)
                    ?.services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} - €{service.price}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Uhrzeit
              </label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Wählen Sie eine Uhrzeit" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <div className="p-6">
            <Button type="submit" className="w-full">
              Buchen
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

