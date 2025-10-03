"use client"

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Stats = Awaited<ReturnType<typeof api.adminStats>>

export default function AdminPage() {
	const [stats, setStats] = useState<Stats | null>(null)
	const [logs, setLogs] = useState<any[]>([])
	const [file, setFile] = useState<File | null>(null)
	const [uploadResult, setUploadResult] = useState<any | null>(null)

	useEffect(() => {
		api.adminStats().then(setStats).catch(() => setStats(null))
		api.adminAuditLogs().then((d: any) => setLogs(d.logs || [])).catch(() => setLogs([]))
	}, [])

	const handleUpload = async () => {
		if (!file) return
		const res = await api.adminRagUpload(file, 'career_framework')
		setUploadResult(res)
	}

	return (
		<div className="min-h-screen p-6 space-y-8">
			<h1 className="text-2xl font-bold">Admin Dashboard (Mock)</h1>

			<section className="bg-white p-4 rounded border">
				<h2 className="font-semibold mb-3">Overview Stats</h2>
				{stats ? (
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
						<div>Active Tenants: <span className="font-medium">{stats.active_tenants}</span></div>
						<div>Active Sessions: <span className="font-medium">{stats.active_sessions}</span></div>
						<div>Completed Sessions: <span className="font-medium">{stats.completed_sessions}</span></div>
						<div>Total Goals: <span className="font-medium">{stats.total_goals_created}</span></div>
						<div>Avg Score: <span className="font-medium">{stats.avg_score}</span></div>
						<div>Avg Completion: <span className="font-medium">{stats.avg_completion_rate}%</span></div>
					</div>
				) : (
					<div className="text-sm text-gray-500">Loading stats…</div>
				)}
			</section>

			<section className="bg-white p-4 rounded border">
				<h2 className="font-semibold mb-3">RAG Upload (Mock)</h2>
				<div className="flex gap-3 items-end">
					<div className="flex-1">
						<Label className="text-xs">PDF</Label>
						<Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
					</div>
					<Button onClick={handleUpload} className="bg-black hover:bg-gray-800">Upload</Button>
				</div>
				{uploadResult && (
					<div className="text-xs text-gray-700 mt-3">Result: {JSON.stringify(uploadResult)}</div>
				)}
			</section>

			<section className="bg-white p-4 rounded border">
				<h2 className="font-semibold mb-3">Audit Logs (Mock)</h2>
				<div className="space-y-2 text-xs">
					{logs.map((log) => (
						<div key={log.id} className="border rounded p-2">
							<div className="font-medium">{log.action}</div>
							<div className="text-gray-600">{log.created_at}</div>
							<div className="mt-1 text-gray-700 truncate">{JSON.stringify(log.payload)}</div>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}

