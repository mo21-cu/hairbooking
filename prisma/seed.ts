import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Admin User erstellen
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      hashedPassword: adminPassword,
      role: 'ADMIN',
    },
  })

  // Normale User erstellen
  const userPassword = await hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      hashedPassword: userPassword,
      role: 'USER',
    },
  })

  // Services erstellen
  const haircut = await prisma.service.create({
    data: {
      name: 'Herrenhaarschnitt',
      description: 'Klassischer Herrenhaarschnitt inkl. Waschen und Styling',
      duration: 30,
      price: 29.99,
    },
  })

  const coloring = await prisma.service.create({
    data: {
      name: 'Haarfärbung',
      description: 'Professionelle Haarfärbung inkl. Beratung',
      duration: 120,
      price: 89.99,
    },
  })

  // Buchung und Review erstellen
  const booking = await prisma.booking.create({
    data: {
      date: new Date('2024-04-01T10:00:00Z'),
      status: 'COMPLETED',
      userId: user.id,
      serviceId: haircut.id,
    },
  })

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Sehr zufrieden mit dem Service!',
      userId: user.id,
      bookingId: booking.id,
    },
  })

  console.log('Seed erfolgreich ausgeführt!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 