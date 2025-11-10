import React, { useState, useEffect } from 'react'
import { Button } from './common/Button'
import { Input } from './common/Input'
import { Notification } from './common/Notification'

export function BankingTab() {
  const [cbData, setCbData] = useState(null)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { fetchCBData() }, [])

  const fetchCBData = () => {
    fetch('http://localhost:3001/api/compliance/cb?shipId=R001&year=2024')
      .then(res => res.json())
      .then(setCbData)
  }

  const handleBank = () => {
    const bankAmount = parseFloat(amount)
    if (bankAmount <= 0) { setMessage('Amount must be positive'); return }
    fetch('http://localhost:3001/api/banking/bank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipId: 'R001', year: 2024, amount: bankAmount })
    })
    .then(res => res.json())
    .then(data => { setMessage(data.message); setAmount(''); fetchCBData() })
    .catch(err => setMessage(err.message))
  }

  const handleApply = () => {
    const applyAmount = parseFloat(amount)
    fetch('http://localhost:3001/api/banking/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipId: 'R001', year: 2024, amount: applyAmount })
    })
    .then(res => res.json())
    .then(data => { setMessage(data.message); setAmount(''); fetchCBData() })
    .catch(err => setMessage(err.message))
  }

  if (!cbData) return <div>Loading...</div>

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Banking (Article 20)</h2>
      <div className="border border-gray-300 p-4 mb-4 rounded">
        <h3 className="font-semibold mb-2">Current Compliance Balance</h3>
        <p>Ship: {cbData.shipId}</p>
        <p>Year: {cbData.year}</p>
        <p>CB: {cbData.cbGco2eq} gCO₂eq</p>
        <p>Status: {cbData.isBanked ? 'Banked' : 'Not Banked'}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Banking Actions</h3>
        <div className="flex space-x-2 mb-2">
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
          <Button onClick={handleBank} disabled={cbData.cbGco2eq <= 0}>Bank Surplus</Button>
          <Button onClick={handleApply}>Apply Banked</Button>
        </div>
      </div>

      <Notification message={message} />
    </div>
  )
}
