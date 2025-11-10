import React from 'react'

export function Button({ children, onClick, disabled = false, type = 'primary' }) {
  const base = 'px-4 py-2 rounded font-medium transition-colors duration-200'
  const styles = disabled
    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
    : type === 'primary'
    ? 'bg-blue-500 hover:bg-blue-600 text-white'
    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  )
}
