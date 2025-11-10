import React, { useState, useEffect } from 'react'
import { Chart } from './common/Chart'

export function CompareTab() {
  const [comparisonData, setComparisonData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3001/api/routes/comparison')
      .then(res => res.json())
      .then(setComparisonData)
  }, [])

  if (!comparisonData) return <div>Loading...</div>

  const comparisons = comparisonData.comparisons || []
  const target = 89.3368

  // KPIs
  const avgBaseline =
    comparisons.length > 0
      ? (
          comparisons.reduce((sum, r) => sum + (r.baseline || target), 0) /
          comparisons.length
        ).toFixed(2)
      : 0

  const avgCompare =
    comparisons.length > 0
      ? (
          comparisons.reduce((sum, r) => sum + (r.ghgIntensity || 0), 0) /
          comparisons.length
        ).toFixed(2)
      : 0

  const complianceRate =
    comparisons.length > 0
      ? (
          (comparisons.filter(r => r.compliant).length / comparisons.length) *
          100
        ).toFixed(1)
      : 0

  const labels = comparisons.map(r => r.routeId)
  const baselineData = comparisons.map(r => r.baseline || target)
  const comparisonValues = comparisons.map(r => r.ghgIntensity)

    return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 shadow p-4 rounded transition-colors duration-300">
          <p className="text-sm text-gray-500">Avg Baseline Intensity</p>
          <h3 className="text-2xl font-semibold text-blue-600">{avgBaseline}</h3>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-sm text-gray-500">Avg Comparison Intensity</p>
          <h3 className="text-2xl font-semibold text-yellow-600">{avgCompare}</h3>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-sm text-gray-500">Compliance Rate</p>
          <h3 className="text-2xl font-semibold text-green-600">{complianceRate}%</h3>
        </div>
      </div>

      {/* CHART + TABLE GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-white shadow p-4 rounded flex flex-col">
          <h3 className="font-semibold mb-2">Baseline vs Comparison</h3>
          <div className="flex-1 min-h-[300px]">
            <Chart
              labels={labels}
              baselineData={baselineData}
              comparisonData={comparisonValues}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow p-4 rounded overflow-x-auto">
          <h3 className="font-semibold mb-2">Route-wise Details</h3>
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 border text-left font-semibold text-gray-600">Route ID</th>
                <th className="px-4 py-2 border text-left font-semibold text-gray-600">Baseline</th>
                <th className="px-4 py-2 border text-left font-semibold text-gray-600">Comparison</th>
                <th className="px-4 py-2 border text-left font-semibold text-gray-600">% Diff</th>
                <th className="px-4 py-2 border text-center font-semibold text-gray-600">Compliance</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border">{r.routeId}</td>
                  <td className="px-4 py-2 border text-blue-600 font-medium">{r.baseline || target}</td>
                  <td className="px-4 py-2 border text-yellow-600 font-medium">{r.ghgIntensity}</td>
                  <td
                    className={`px-4 py-2 border font-semibold ${
                      r.percentDiff > 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {r.percentDiff.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {r.compliant ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">✅</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">❌</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
