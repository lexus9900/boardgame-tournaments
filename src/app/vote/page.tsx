'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Vote() {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selected, setSelected] = useState('')
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const supabase = createClient()
  const router = useRouter()
  const currentMonth = new Date().toISOString().slice(0, 7)

  useEffect(() => {
    supabase
      .from('game_suggestions')
      .select('id, game_name')
      .eq('month_year', currentMonth)
      .then(({ data }) => setSuggestions(data || []))
  }, [])

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase.from('votes').upsert({
      user_id: user.id,
      suggestion_id: selected,
      preferred_date: date || null,
      month_year: currentMonth,
    }, { onConflict: 'user_id,month_year' })

    setMessage(error ? error.message : 'Stimme gespeichert!')
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Abstimmen</h1>
      <p className="text-sm text-slate-600 mb-4">Monat: {currentMonth}</p>
      <form onSubmit={handleVote} className="space-y-4">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        >
          <option value="">Spiel wählen</option>
          {suggestions.map((s) => (
            <option key={s.id} value={s.id}>{s.game_name}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
        <button className="w-full bg-green-600 text-white py-3 rounded-lg">
          Abstimmen
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  )
}
