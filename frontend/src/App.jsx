import React, { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar.jsx'
import { Header } from './components/layout/Header.jsx'
import { RoutesTab } from './components/RoutesTab.jsx'
import { CompareTab } from './components/CompareTab.jsx'
import { BankingTab } from './components/BankingTab.jsx'
import { PoolingTab } from './components/PoolingTab.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('routes')

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white shadow rounded-lg p-6 transition-all duration-300">
            {activeTab === 'routes' && <RoutesTab />}
            {activeTab === 'compare' && <CompareTab />}
            {activeTab === 'banking' && <BankingTab />}
            {activeTab === 'pooling' && <PoolingTab />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
