"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaGoogle, FaApple } from "react-icons/fa"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn("email", {
      email,
      redirect: false,
    })
    if (result?.error) {
      console.error(result.error)
    } else {
      setIsEmailSent(true)
    }
  }

  const handleProviderSignIn = (provider: string) => () => {
    signIn(provider, { callbackUrl: "/" })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Choose your preferred login method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleProviderSignIn("google")} className="w-full flex items-center justify-center gap-2">
            <FaGoogle />
            Sign in with Google
          </Button>
          <Button onClick={handleProviderSignIn("apple")} className="w-full flex items-center justify-center gap-2">
            <FaApple />
            Sign in with Apple
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          {isEmailSent ? (
            <p className="text-center text-green-600">Check your email for a login link!</p>
          ) : (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full">
                Sign in with Email
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

