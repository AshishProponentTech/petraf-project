"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

type LoginForm = {
  company_name: string
  admin_email: string
  password: string
}

export default function AdminLoginPage() {
  const [formData, setFormData] = useState<LoginForm>({
    company_name: '',
    admin_email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: formData.company_name,
          admin_email: formData.admin_email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('admin_key', data.admin_key)
        localStorage.setItem('tenant_id', data.tenant_id)
        localStorage.setItem('company_name', data.company_name)
        setSuccess(true)
        setTimeout(() => {
          window.location.href = '/admin'
        }, 2000)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <CardTitle className="text-2xl">Login Successful!</CardTitle>
            <CardDescription>
              Redirecting to admin dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-bold inline-block mb-4">
            ADMIN
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your company admin panel
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => updateFormData('company_name', e.target.value)}
                  placeholder="Sunrise Corporation"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Try "Sunrise" or "Test" for demo access
                </p>
              </div>

              <div>
                <Label htmlFor="admin_email">Admin Email</Label>
                <Input
                  id="admin_email"
                  type="email"
                  required
                  value={formData.admin_email}
                  onChange={(e) => updateFormData('admin_email', e.target.value)}
                  placeholder="john.davis@sunrisecorp.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="Your secure password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>Company:</strong> Sunrise Corporation</p>
                <p><strong>Email:</strong> john.davis@sunrisecorp.com</p>
                <p><strong>Password:</strong> (any password works for demo)</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-900 mb-2">For New Companies:</h3>
              <div className="text-xs text-yellow-800">
                <p>Company setup is done via database seed script:</p>
                <div className="bg-gray-100 p-2 rounded font-mono text-xs mt-2">
                  python -m app.database.seed_tenant \<br/>
                  &nbsp;&nbsp;--slug "your-company" \<br/>
                  &nbsp;&nbsp;--name "Your Company" \<br/>
                  &nbsp;&nbsp;--domain "yourcompany.petraf.com" \<br/>
                  &nbsp;&nbsp;--admin-email "admin@yourcompany.com"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Need help? Contact support at admin@petraf.com</p>
        </div>
      </div>
    </div>
  )
}