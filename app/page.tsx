import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Willkommen bei MSSC Barbers Club</h1>
      <p className="text-xl mb-8 text-center">
        Buchen Sie Ihren nächsten Termin mit einem unserer besten Barber
      </p>
      <div className="flex justify-center">
        <Button asChild>
          <Link href="/book">Terminbuchung</Link>
        </Button>
      </div>
    </div>
  )
}

