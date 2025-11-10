import React from 'react'

export function Notification({ message }) {
  if (!message) return null
  const isSuccess = message.includes('✅') || message.toLowerCase().includes('success')
  return (
    <div className={`p-3 rounded mt-4 border ${isSuccess ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
      {message}
    </div>
  )
}
