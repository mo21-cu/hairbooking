import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// This would typically come from a database
const stylists = [
  {
    id: 1,
    name: "Sanel",
    specialty: "Barber",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Sanel is a master barber with over 10 years of experience in classic and modern cuts.",
    services: [
      { name: "Haircut", price: 30, duration: 30 },
      { name: "Beard Trim", price: 20, duration: 20 },
      { name: "Hot Towel Shave", price: 35, duration: 45 },
    ],
  },
  {
    id: 2,
    name: "Mehmed",
    specialty: "Barber",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Mehmed specializes in precision fades and intricate designs.",
    services: [
      { name: "Haircut", price: 35, duration: 45 },
      { name: "Beard Trim", price: 25, duration: 30 },
      { name: "Hair Design", price: 50, duration: 60 },
    ],
  },
  {
    id: 3,
    name: "Max",
    specialty: "Barber",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Max is known for his expertise in traditional barbering techniques and modern styling.",
    services: [
      { name: "Haircut", price: 40, duration: 45 },
      { name: "Beard Trim", price: 30, duration: 30 },
      { name: "Hair and Beard Combo", price: 60, duration: 75 },
    ],
  },
]

export default function StylistPage({ params }: { params: { id: string } }) {
  const stylist = stylists.find((s) => s.id === Number.parseInt(params.id))

  if (!stylist) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{stylist.name}</CardTitle>
          <CardDescription>{stylist.specialty}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Image
              src={stylist.image || "/placeholder.svg"}
              alt={stylist.name}
              width={400}
              height={400}
              className="rounded-lg"
            />
            <div>
              <h3 className="text-xl font-semibold mb-2">About {stylist.name}</h3>
              <p>{stylist.bio}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Services</h3>
            <ul className="space-y-2">
              {stylist.services.map((service) => (
                <li key={service.name} className="flex justify-between items-center">
                  <span>{service.name}</span>
                  <span>
                    €{service.price} ({service.duration} min)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/book?stylist=${stylist.id}`}>Book with {stylist.name}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

