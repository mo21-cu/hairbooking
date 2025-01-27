import { prisma } from '@/app/lib/prisma'

export default async function Stylists() {
  const services = await prisma.service.findMany()
  
  return (
    <div>
      <h1>Unsere Services</h1>
      <div>
        {services.map((service) => (
          <div key={service.id}>
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <p>Dauer: {service.duration} Minuten</p>
            <p>Preis: {service.price}€</p>
          </div>
        ))}
      </div>
    </div>
  )
}

