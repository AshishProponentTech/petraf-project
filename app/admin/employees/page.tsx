"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'

type Employee = {
  id: string
  employee_code: string
  name: string
  email: string
  department: string
  position: string
  grade: string
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  last_login?: string
  session_count: number
  goals_completed: number
}

type TokenGenerationRequest = {
  employee_id: string
  expires_in_days: number
  send_email: boolean
  custom_message?: string
}

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  const [tokenRequest, setTokenRequest] = useState<TokenGenerationRequest>({
    employee_id: '',
    expires_in_days: 7,
    send_email: true,
    custom_message: ''
  })
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      // Load real employees from API
      const employees = await api.getEmployees()
      setEmployees(employees)
    } catch (error) {
      console.error('Failed to load employees:', error)
      setEmployees([]) // Show empty state on error
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateToken = async () => {
    if (!selectedEmployee) return

    try {
      setGenerating(true)
      
      // Generate real token via API
      const response = await api.generateEmployeeToken({
        employee_id: selectedEmployee.id,
        expires_in_days: tokenRequest.expires_in_days,
        send_email: tokenRequest.send_email,
        custom_message: tokenRequest.custom_message
      })
      
      setGeneratedToken(response.token)
      
    } catch (error) {
      console.error('Failed to generate token:', error)
      alert('Failed to generate token. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const copyTokenToClipboard = async () => {
    if (generatedToken) {
      await navigator.clipboard.writeText(generatedToken)
      alert('Token copied to clipboard!')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-gray-600">Manage employees and generate access tokens</p>
        </div>
        <Button 
          onClick={() => setShowTokenDialog(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Generate Token
        </Button>
      </div>

      {/* Employee List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">Loading employees...</div>
        ) : (
          employees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <CardDescription>
                      {employee.position} • {employee.department} • {employee.grade}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedEmployee(employee)
                        setTokenRequest(prev => ({ ...prev, employee_id: employee.id }))
                        setShowTokenDialog(true)
                      }}
                    >
                      Generate Token
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-500">Employee Code</Label>
                    <p className="font-medium">{employee.employee_code}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="font-medium">{employee.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Sessions</Label>
                    <p className="font-medium">{employee.session_count}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Goals Completed</Label>
                    <p className="font-medium">{employee.goals_completed}</p>
                  </div>
                </div>
                {employee.last_login && (
                  <div className="mt-2 text-xs text-gray-500">
                    Last login: {new Date(employee.last_login).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Token Generation Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Employee Token</DialogTitle>
            <DialogDescription>
              Create an access token for {selectedEmployee?.name || 'selected employee'}
            </DialogDescription>
          </DialogHeader>

          {!generatedToken ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="expires_in_days">Token Expires In</Label>
                <Select 
                  value={tokenRequest.expires_in_days.toString()} 
                  onValueChange={(value) => setTokenRequest(prev => ({ 
                    ...prev, 
                    expires_in_days: parseInt(value) 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="send_email"
                  checked={tokenRequest.send_email}
                  onChange={(e) => setTokenRequest(prev => ({ 
                    ...prev, 
                    send_email: e.target.checked 
                  }))}
                  className="rounded"
                />
                <Label htmlFor="send_email">Send token via email</Label>
              </div>

              <div>
                <Label htmlFor="custom_message">Custom Message (Optional)</Label>
                <Textarea
                  id="custom_message"
                  placeholder="Your goal-setting session token is ready! Click the link below to start your session..."
                  value={tokenRequest.custom_message}
                  onChange={(e) => setTokenRequest(prev => ({ 
                    ...prev, 
                    custom_message: e.target.value 
                  }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowTokenDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateToken}
                  disabled={generating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {generating ? 'Generating...' : 'Generate Token'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Token Generated Successfully!</h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm text-gray-600">Employee</Label>
                    <p className="font-medium">{selectedEmployee?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Token</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        value={generatedToken} 
                        readOnly 
                        className="font-mono text-sm"
                      />
                      <Button 
                        size="sm" 
                        onClick={copyTokenToClipboard}
                        variant="outline"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Expires</Label>
                    <p className="text-sm">
                      {new Date(Date.now() + tokenRequest.expires_in_days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowTokenDialog(false)
                    setGeneratedToken(null)
                    setSelectedEmployee(null)
                  }}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setGeneratedToken(null)
                    setSelectedEmployee(null)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Generate Another
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
