import React, { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export function Header() {
  const [dark, setDark] = useState(
    localStorage.getItem('theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        FuelEU Compliance Dashboard
      </h1>
      <button
        onClick={() => setDark(!dark)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {dark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-700" />}
      </button>
    </div>
  )
}
