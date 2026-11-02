'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'

export default function Leaderboard() {
  const [results, setResults] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('tournament_results')
      .select('points, position, game_name, user_id')
      .order('points', { ascending: false })
      .then(async ({ data }) => {
        if (!data) return setResults([])
        const userIds = data.map(r => r.user_id)
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, username')
          .in('id', userIds)
        const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]))
        setResults(data.map(r => ({ ...r, profile: profileMap[r.user_id] })))
      })
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
      {results.length === 0 ? (
        <p className="text-slate-500">Noch keine Ergebnisse eingetragen.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium">Platz</th>
                <th className="px-4 py-3 text-sm font-medium">Spieler</th>
                <th className="px-4 py-3 text-sm font-medium">Punkte</th>
                <th className="px-4 py-3 text-sm font-medium">Spiel</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3">{r.position || i + 1}</td>
                  <td className="px-4 py-3">{r.profile?.display_name || r.profile?.username || 'Unbekannt'}</td>
                  <td className="px-4 py-3 font-semibold">{r.points}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{r.game_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
