import React, { useState, useEffect } from 'react'

export function RoutesTab() {
  const [routes, setRoutes] = useState([])
  const [search, setSearch] = useState('')
  const [filterVessel, setFilterVessel] = useState('All')
  const [filterFuel, setFilterFuel] = useState('All')

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = () => {
    fetch('http://localhost:3001/api/routes')
      .then(res => res.json())
      .then(setRoutes)
  }

  const setBaseline = (routeId) => {
    fetch(`http://localhost:3001/api/routes/${routeId}/baseline`, { method: 'POST' })
      .then(() => fetchRoutes())
  }

  // filtering + search logic
  const filteredRoutes = routes.filter(route => {
    const matchSearch = route.routeId.toLowerCase().includes(search.toLowerCase())
    const matchVessel = filterVessel === 'All' || route.vesselType === filterVessel
    const matchFuel = filterFuel === 'All' || route.fuelType === filterFuel
    return matchSearch && matchVessel && matchFuel
  })

  const avgGHG = routes.length
    ? (routes.reduce((sum, r) => sum + parseFloat(r.ghgIntensity || 0), 0) / routes.length).toFixed(2)
    : 0

  const baselineRoute = routes.find(r => r.isBaseline)?.routeId || 'Not Set'

  return (
    <div>
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow p-4 rounded transition-colors duration-300">
          <p className="text-sm text-gray-500">Total Routes</p>
          <h3 className="text-2xl font-semibold text-gray-800">{routes.length}</h3>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-sm text-gray-500">Baseline Route</p>
          <h3 className="text-2xl font-semibold text-blue-600">{baselineRoute}</h3>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-sm text-gray-500">Average GHG Intensity</p>
          <h3 className="text-2xl font-semibold text-green-600">{avgGHG}</h3>
        </div>
      </div>

      {/* FILTERS + SEARCH */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex space-x-2">
          <select
            value={filterVessel}
            onChange={e => setFilterVessel(e.target.value)}
            className="border rounded px-3 py-2 text-sm text-gray-700"
          >
            <option value="All">All Vessel Types</option>
            <option value="Container">Container</option>
            <option value="Tanker">Tanker</option>
            <option value="BulkCarrier">BulkCarrier</option>
            <option value="RoRo">RoRo</option>
          </select>

          <select
            value={filterFuel}
            onChange={e => setFilterFuel(e.target.value)}
            className="border rounded px-3 py-2 text-sm text-gray-700"
          >
            <option value="All">All Fuel Types</option>
            <option value="HFO">HFO</option>
            <option value="LNG">LNG</option>
            <option value="MGO">MGO</option>
          </select>
        </div>

        <div className="relative mt-2 sm:mt-0">
          <input
            type="text"
            placeholder="Search Route ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 pl-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <svg
            className="w-4 h-4 absolute left-2 top-3 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.5-1.5z" />
          </svg>
        </div>
      </div>

      {/* ROUTES TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-600">Route ID</th>
              <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-600">Vessel Type</th>
              <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-600">Fuel Type</th>
              <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-600">GHG Intensity</th>
              <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map(route => (
              <tr key={route.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border text-sm">{route.routeId}</td>
                <td className="px-4 py-2 border text-sm">{route.vesselType}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      route.fuelType === 'LNG'
                        ? 'bg-green-100 text-green-700'
                        : route.fuelType === 'HFO'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {route.fuelType}
                  </span>
                </td>
                <td className="px-4 py-2 border text-sm">{route.ghgIntensity}</td>
                <td className="px-4 py-2 border text-sm">
                  {!route.isBaseline ? (
                    <button
                      onClick={() => setBaseline(route.routeId)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Set Baseline
                    </button>
                  ) : (
                    <span className="text-green-600 font-semibold text-sm">Baseline</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
