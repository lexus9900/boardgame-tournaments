'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Trophy, Vote, PlusCircle, LogOut, User } from 'lucide-react'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) return <div className="text-center py-20">Laden...</div>

  return (
    <div>
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="text-amber-500" />
          Brettspiel Turniere
        </h1>
        {user ? (
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <LogOut size={16} /> Logout
          </button>
        ) : (
          <Link href="/login" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm">
            Login
          </Link>
        )}
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/suggest" className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <PlusCircle className="text-blue-500 mb-3" size={28} />
          <h2 className="font-semibold text-lg">Spiel vorschlagen</h2>
          <p className="text-slate-600 text-sm mt-1">Schlage ein Spiel für den nächsten Monat vor.</p>
        </Link>

        <Link href="/vote" className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <Vote className="text-green-500 mb-3" size={28} />
          <h2 className="font-semibold text-lg">Abstimmen</h2>
          <p className="text-slate-600 text-sm mt-1">Stimme für Spiel und Wunschdatum ab.</p>
        </Link>

        <Link href="/leaderboard" className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <Trophy className="text-amber-500 mb-3" size={28} />
          <h2 className="font-semibold text-lg">Leaderboard</h2>
          <p className="text-slate-600 text-sm mt-1">Aktuelle Rangliste der Spieler.</p>
        </Link>

        <Link href="/results" className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <User className="text-purple-500 mb-3" size={28} />
          <h2 className="font-semibold text-lg">Ergebnis eintragen</h2>
          <p className="text-slate-600 text-sm mt-1">Trage deine Punkte nach dem Turnier ein.</p>
        </Link>
      </div>

      {user && (
        <div className="mt-12 text-center text-sm text-slate-500">
          Eingeloggt als {user.email}
        </div>
      )}
    </div>
  )
}
