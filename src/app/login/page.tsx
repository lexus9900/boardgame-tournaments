'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      setMessage(error ? error.message : 'Bestätigungs-Mail gesendet!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else router.push('/')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isSignUp ? 'Account erstellen' : 'Login'}
      </h1>
      <form onSubmit={handleAuth} className="space-y-4">
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        />
        <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium">
          {isSignUp ? 'Registrieren' : 'Einloggen'}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-6 text-sm text-slate-600 underline w-full text-center"
      >
        {isSignUp ? 'Schon einen Account? Login' : 'Noch kein Account? Registrieren'}
      </button>
    </div>
  )
}
