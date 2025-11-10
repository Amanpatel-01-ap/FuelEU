import React, { useState, useEffect } from 'react'
import { Button } from './common/Button'
import { Notification } from './common/Notification'

export function PoolingTab() {
  const [members, setMembers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [poolResult, setPoolResult] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const mockMembers = [
      { shipId: 'R001', cbBefore: 50000 },
      { shipId: 'R002', cbBefore: -80000 },
      { shipId: 'R003', cbBefore: -50000 },
      { shipId: 'R004', cbBefore: 30000 },
      { shipId: 'R005', cbBefore: -40000 }
    ]
    setMembers(mockMembers)
  }, [])

  const toggleMember = (shipId) => {
    setSelectedMembers(prev => prev.includes(shipId) ? prev.filter(id => id!==shipId) : [...prev, shipId])
  }

  const createPool = () => {
    const selectedData = members.filter(m => selectedMembers.includes(m.shipId))
    const totalCB = selectedData.reduce((sum,m)=>sum+m.cbBefore,0)
    const isValid = totalCB >= 0
    if (!isValid) {
      setMessage('❌ Invalid Pool: Total compliance balance must be non-negative')
      setPoolResult({ members: selectedData, totalCB, isValid:false })
      return
    }
    setPoolResult({ members: selectedData.map(m=>({...m, cbAfter: m.cbBefore>=0?m.cbBefore:0})), totalCB, isValid:true })
    setMessage('✅ Pool created successfully!')
  }

  const currentPoolSum = members.filter(m=>selectedMembers.includes(m.shipId)).reduce((sum,m)=>sum+m.cbBefore,0)

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Pooling (Article 21)</h2>
      <div className="border border-gray-300 p-4 mb-4 rounded">
        <h3 className="font-semibold mb-2">Pooling Rules:</h3>
        <ul className="list-disc list-inside">
          <li>Total CB must be ≥ 0</li>
          <li>Deficit ships cannot exit worse</li>
          <li>Surplus ships cannot exit negative</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Available Ships</h3>
        <div className="space-y-2">
          {members.map(m=>(
            <label key={m.shipId} className="flex items-center space-x-2">
              <input type="checkbox" checked={selectedMembers.includes(m.shipId)} onChange={()=>toggleMember(m.shipId)} />
              <span>{m.shipId} - CB: {m.cbBefore} gCO₂eq {m.cbBefore>=0?'✅ Surplus':'❌ Deficit'}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <Button onClick={createPool} disabled={selectedMembers.length===0}>Create Pool</Button>
        {selectedMembers.length>0 && (
          <div className={`font-semibold ${currentPoolSum>=0?'text-green-600':'text-red-600'}`}>
            Pool Sum: {currentPoolSum} gCO₂eq {currentPoolSum>=0?'✅ Valid':'❌ Invalid'}
          </div>
        )}
      </div>

      <Notification message={message} />

      {poolResult && (
        <div className={`border p-4 rounded ${poolResult.isValid?'border-green-400':'border-red-400'} mt-4`}>
          <h3 className="font-semibold mb-2">Pool Results - {poolResult.isValid?'VALID':'INVALID'}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Ship ID</th>
                  <th className="px-4 py-2 border">CB Before</th>
                  <th className="px-4 py-2 border">CB After</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {poolResult.members.map(m=>(
                  <tr key={m.shipId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{m.shipId}</td>
                    <td className="px-4 py-2 border">{m.cbBefore}</td>
                    <td className="px-4 py-2 border">{m.cbAfter||m.cbBefore}</td>
                    <td className="px-4 py-2 border">{poolResult.isValid?'✅ Valid':'❌ Invalid Pool'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 font-semibold">Total Pool CB: {poolResult.totalCB} gCO₂eq</p>
        </div>
      )}
    </div>
  )
}
