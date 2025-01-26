"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-primary text-primary-foreground">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/stylists" className="hover:underline">
              Unser Team
            </Link>
          </li>
          <li>
            <Link href="/book" className="hover:underline">
              Terminbuchung
            </Link>
          </li>
        </ul>
        <div>
          {session ? (
            <Button onClick={() => signOut()} variant="outline">
              Logout
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}

