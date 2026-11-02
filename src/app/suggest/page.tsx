'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Suggest() {
  const [gameName, setGameName] = useState('')
  const [message, setMessage] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const currentMonth = new Date().toISOString().slice(0, 7)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase.from('game_suggestions').insert({
      user_id: user.id,
      game_name: gameName.trim(),
      month_year: currentMonth,
    })

    if (error) setMessage(error.message)
    else {
      setMessage('Vorschlag gespeichert!')
      setGameName('')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Spiel vorschlagen</h1>
      <p className="text-sm text-slate-600 mb-4">Für den Monat: {currentMonth}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Name des Spiels"
          className="w-full border rounded-lg px-4 py-3"
          required
        />
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Vorschlagen
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  )
}
