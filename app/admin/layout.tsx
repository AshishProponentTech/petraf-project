"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: '📊'
  },
  {
    title: 'Employee Management',
    href: '/admin/employees',
    icon: '👥'
  },
  {
    title: 'Session Management',
    href: '/admin/sessions',
    icon: '🔄'
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    // Check if admin is authenticated
    const adminKey = localStorage.getItem('admin_key')
    const company = localStorage.getItem('company_name')
    
    if (adminKey && company) {
      setIsAuthenticated(true)
      setCompanyName(company)
    } else if (pathname !== '/admin/login') {
      // Redirect to login if not authenticated and not already on login page
      window.location.href = '/admin/login'
    }
  }, [pathname])

  // Don't render layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
                  ADMIN
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {companyName} Admin
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, Admin
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('admin_key')
                  localStorage.removeItem('tenant_id')
                  localStorage.removeItem('company_name')
                  window.location.href = '/admin/login'
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to App
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Sidebar */}
          <nav className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Admin Panel</h3>
              <ul className="space-y-2">
                {adminNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Employees</span>
                  <span className="font-medium">25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Sessions</span>
                  <span className="font-medium text-blue-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Goals</span>
                  <span className="font-medium text-green-600">142</span>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
