import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

export default async function Stylists() {
  const stylists = await prisma.stylist.findMany({
    include: { services: true },
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Unser Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stylists.map((stylist) => (
          <Card key={stylist.id}>
            <CardHeader>
              <CardTitle>{stylist.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={stylist.image || "/placeholder.svg"}
                alt={stylist.name}
                width={200}
                height={200}
                className="rounded-full mx-auto mb-4"
              />
              <p className="text-center">{stylist.specialty}</p>
              <ul className="mt-4">
                {stylist.services.map((service) => (
                  <li key={service.id} className="flex justify-between">
                    <span>{service.name}</span>
                    <span>€{service.price}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href={`/book?stylist=${stylist.id}`}>Buchen mit {stylist.name}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

