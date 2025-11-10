import React from 'react'
import { Home, BarChart3, Wallet, Layers } from 'lucide-react'

const tabs = [
  { id: 'routes', label: 'Routes', icon: Home },
  { id: 'compare', label: 'Compare', icon: BarChart3 },
  { id: 'banking', label: 'Banking', icon: Wallet },
  { id: 'pooling', label: 'Pooling', icon: Layers }
]

export function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="h-screen w-56 bg-gradient-to-b from-blue-700 to-blue-900 text-white dark:from-gray-900 dark:to-gray-950 flex flex-col justify-between transition-colors duration-300">

      <div>
        <h2 className="text-2xl font-bold text-center py-6 tracking-wide">FuelEU</h2>
        <nav className="mt-4 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 w-full px-4 py-2 text-left transition-colors duration-200 ${
                  isActive
                  ? 'bg-blue-500 text-white dark:bg-blue-600'
                  : 'hover:bg-blue-600 hover:text-gray-100 text-gray-300 dark:hover:bg-gray-800 dark:text-gray-400'

                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
      <div className="text-center py-4 text-xs text-gray-300 border-t border-blue-600">
        © 2025 FuelEU
      </div>
    </div>
  )
}
