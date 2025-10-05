"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'

type Session = {
  id: string
  employee_code: string
  employee_name: string
  department: string
  position: string
  phase: string
  step: string
  status: 'active' | 'completed' | 'abandoned'
  created_at: string
  last_accessed_at: string
  expires_at: string
  goals_completed: number
  total_goals: number
  completion_percentage: number
  resume_token: string
}

type SessionStats = {
  total_sessions: number
  active_sessions: number
  completed_sessions: number
  abandoned_sessions: number
  avg_completion_rate: number
  avg_session_duration: number
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadSessions()
    loadStats()
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)
      // Load real sessions from API
      const sessions = await api.getEmployeeSessions()
      setSessions(sessions)
    } catch (error) {
      console.error('Failed to load sessions:', error)
      setSessions([]) // Show empty state on error
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Load real stats from API
      const statsData = await api.adminStats()
      setStats({
        total_sessions: statsData.total_sessions || 0,
        active_sessions: statsData.active_sessions || 0,
        completed_sessions: statsData.completed_sessions || 0,
        abandoned_sessions: statsData.abandoned_sessions || 0,
        avg_completion_rate: statsData.avg_completion_rate || 0,
        avg_session_duration: statsData.avg_session_duration || 0
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
      setStats(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'abandoned': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPhaseLabel = (phase: string) => {
    const phaseLabels: Record<string, string> = {
      'g2_basic_info': 'Basic Info',
      'g3_policy': 'Policies',
      'g4_future': 'Future Vision',
      'g4_role': 'Current Role',
      'g6_values': 'Values',
      'g6_themes': 'Themes',
      'g8_focus': 'Challenges',
      'g8_actions': 'Actions',
      'completed': 'Completed'
    }
    return phaseLabels[phase] || phase
  }

  const filteredSessions = sessions.filter(session => {
    const matchesFilter = filter === 'all' || session.status === filter
    const matchesSearch = searchTerm === '' || 
      session.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.department.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const copyTokenToClipboard = async (token: string) => {
    await navigator.clipboard.writeText(token)
    alert('Resume token copied to clipboard!')
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Session Management</h1>
        <p className="text-gray-600">Monitor employee goal-setting sessions</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_sessions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.active_sessions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed_sessions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avg_completion_rate}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name, employee code, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Label htmlFor="filter">Status Filter</Label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="abandoned">Abandoned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sessions List */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Session List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">Loading sessions...</div>
            ) : filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No sessions found</div>
            ) : (
              filteredSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{session.employee_name}</CardTitle>
                        <CardDescription>
                          {session.position} • {session.department} • {session.employee_code}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyTokenToClipboard(session.resume_token)}
                        >
                          Copy Token
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-500">Current Phase</Label>
                        <p className="font-medium">{getPhaseLabel(session.phase)}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Progress</Label>
                        <p className="font-medium">
                          {session.goals_completed}/{session.total_goals} goals ({session.completion_percentage}%)
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Last Accessed</Label>
                        <p className="font-medium">
                          {new Date(session.last_accessed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Expires</Label>
                        <p className="font-medium">
                          {new Date(session.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{session.completion_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${session.completion_percentage}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Analytics</CardTitle>
                <CardDescription>Detailed insights into employee goal-setting sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Average Session Duration</Label>
                      <p className="text-2xl font-bold">{stats?.avg_session_duration} minutes</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Completion Rate</Label>
                      <p className="text-2xl font-bold">{stats?.avg_completion_rate}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-500">Session Status Distribution</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span>Completed</span>
                        <span className="font-medium">{stats?.completed_sessions} sessions</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active</span>
                        <span className="font-medium">{stats?.active_sessions} sessions</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Abandoned</span>
                        <span className="font-medium">{stats?.abandoned_sessions} sessions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
