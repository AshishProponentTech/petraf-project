'use client'

import { useEffect, useState } from 'react'

type User = { id: number; name: string }

export default function UsersPage() {
	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false
		fetch('/api/users')
			.then((res) => {
				if (!res.ok) throw new Error('Failed to load users')
				return res.json()
			})
			.then((data: User[]) => {
				if (!cancelled) setUsers(data)
			})
			.catch((err: unknown) => {
				const message = err instanceof Error ? err.message : 'Unknown error'
				if (!cancelled) setError(message)
			})
			.finally(() => {
				if (!cancelled) setLoading(false)
			})

		return () => {
			cancelled = true
		}
	}, [])

	if (loading) return <div className="p-6">Loading users…</div>
	if (error) return <div className="p-6 text-red-600">{error}</div>

	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold mb-4">Users</h1>
			<ul className="list-disc pl-6 space-y-1">
				{users.map((u) => (
					<li key={u.id}>{u.name}</li>
				))}
			</ul>
		</div>
	)
}




