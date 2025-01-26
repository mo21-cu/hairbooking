"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stylist, setStylist] = useState(null)
  const [services, setServices] = useState([])
  const [newService, setNewService] = useState({ name: "", price: "", duration: "" })

  useEffect(() => {
    if (!session) {
      router.push("/login")
    } else {
      fetchStylistData()
    }
  }, [session, router])

  const fetchStylistData = async () => {
    const response = await fetch("/api/admin/stylist")
    const data = await response.json()
    setStylist(data.stylist)
    setServices(data.services)
  }

  const handleAddService = async () => {
    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      })
      if (response.ok) {
        fetchStylistData()
        setNewService({ name: "", price: "", duration: "" })
      } else {
        throw new Error("Failed to add service")
      }
    } catch (error) {
      console.error("Error adding service:", error)
      alert("Failed to add service. Please try again.")
    }
  }

  const handleDeleteService = async (serviceId) => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchStylistData()
      } else {
        throw new Error("Failed to delete service")
      }
    } catch (error) {
      console.error("Error deleting service:", error)
      alert("Failed to delete service. Please try again.")
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Stylist Administration</h1>
      {stylist && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{stylist.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Email: {stylist.email}</p>
            <p>Specialty: {stylist.specialty}</p>
          </CardContent>
        </Card>
      )}
      <h2 className="text-2xl font-bold mb-4">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Price: €{service.price}</p>
              <p>Duration: {service.duration} minutes</p>
              <Button onClick={() => handleDeleteService(service.id)} variant="destructive" className="mt-2">
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-6">Add New Service</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            />
            <Input
              placeholder="Price"
              type="number"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            />
            <Input
              placeholder="Duration (minutes)"
              type="number"
              value={newService.duration}
              onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
            />
            <Button onClick={handleAddService}>Add Service</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

