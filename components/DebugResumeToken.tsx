"use client";

import { useEffect, useState } from "react";

export default function DebugResumeToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem('petraf_resume_token') || null
      setToken(t)
    } catch {
      setToken(null)
    }
  }, [])

  if (process.env.NEXT_PUBLIC_SHOW_RESUME_TOKEN !== 'true') return null

  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 9999 }}>
      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded shadow-md text-sm text-gray-800">
        <div className="font-medium mb-1">DEV: Resume token</div>
        <div className="break-all mb-2" style={{ maxWidth: 360 }}>{token ?? 'no token yet'}</div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-gray-800 text-white rounded"
            onClick={() => token && navigator.clipboard.writeText(token)}
          >Copy token</button>
          <button
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
            onClick={() => {
              if (!token) return
              const url = `${window.location.origin}/?resume=${encodeURIComponent(token)}`
              navigator.clipboard.writeText(url)
            }}
          >Copy resume link</button>
        </div>
      </div>
    </div>
  )
}
