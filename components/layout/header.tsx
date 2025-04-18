"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Menu, Search, User } from "lucide-react"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try to get user from API
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          // Fallback to localStorage
          const userStr = localStorage.getItem("user")
          if (userStr) {
            try {
              const userData = JSON.parse(userStr)
              setUser(userData)
            } catch (error) {
              console.error("Error parsing user data:", error)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)

        // Fallback to localStorage
        const userStr = localStorage.getItem("user")
        if (userStr) {
          try {
            const userData = JSON.parse(userStr)
            setUser(userData)
          } catch (error) {
            console.error("Error parsing user data:", error)
          }
        }
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")

      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Redirect to login
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
      // Force redirect even if API fails
      window.location.href = "/login"
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex-1">
        <h1 className="text-xl font-bold md:text-2xl">Gas Management System</h1>
      </div>
      <div className="flex items-center gap-4">
        <form className="hidden md:flex">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-64 pl-8" />
          </div>
        </form>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user ? (
                <div>
                  <p>{user.username}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              ) : (
                "My Account"
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

