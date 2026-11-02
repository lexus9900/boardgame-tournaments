'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Results() {
  const [points, setPoints] = useState('')
  const [game, setGame] = useState('')
  const [message, setMessage] = useState('')
  const supabase = createClient()
  const currentMonth = new Date().toISOString().slice(0, 7)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage('Bitte einloggen')
      return
    }

    const { error } = await supabase.from('tournament_results').upsert({
      user_id: user.id,
      month_year: currentMonth,
      points: parseInt(points),
      game_name: game,
    }, { onConflict: 'user_id,month_year' })

    setMessage(error ? error.message : 'Ergebnis gespeichert!')
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ergebnis eintragen</h1>
      <p className="text-sm text-slate-500 mb-4">Trage deine eigenen Punkte ein (für den aktuellen Monat).</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Punkte"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        />
        <input
          placeholder="Gespieltes Spiel"
          value={game}
          onChange={(e) => setGame(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
        <button className="w-full bg-slate-900 text-white py-3 rounded-lg">
          Speichern
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  )
}
