import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from 'lucide-react'
import ThemeToggle from './Theme'
import { routes } from '@/data/routes'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const userRole = user?.role ?? 'artist'
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NavLinks = () => (
    <nav className="mt-5">
      <ul>
        {routes[userRole as keyof typeof routes].map((item) => (
          <li key={item.path} className="mb-2">
            <Link
              to={item.path}
              className={cn(
                "block px-4 py-2 mx-2 text-sm font-medium rounded-lg",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground dark:bg-primary-foreground dark:text-primary"
                  : "text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )

  if (isLoading) {
    return null
  }

  return (
    <div className=''>
      <div className="flex h-screen">
        <aside className="hidden md:block w-64 bg-white dark:bg-black shadow-md">
          <NavLinks />
        </aside>

        <div className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )} onClick={() => setIsMobileMenuOpen(false)} />
        <aside className={cn(
          "fixed top-0 left-0 w-64 h-full bg-white dark:bg-black shadow-md z-50 transform transition-transform duration-200 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <NavLinks />
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white dark:bg-black shadow-sm">
            <div className="max-w-[1400px] mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="md:hidden mr-4" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
                <span className="mr-4 text-sm text-gray-600 dark:text-primary hidden sm:inline">
                  Welcome, {user?.first_name || 'User'}
                </span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-primary">Artist Management System</h1>
              <div className="flex gap-2 items-center">
                <ThemeToggle />
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 flex overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-primary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}