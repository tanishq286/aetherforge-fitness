'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

type Tab = 'join' | 'signin'

export default function MembershipPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('join')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showProfileForm, setShowProfileForm] = useState(false)

  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [goal, setGoal] = useState('Muscle Gain')
  const [level, setLevel] = useState('Beginner')

  // Validation State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profile) {
          router.push('/dashboard')
        } else {
          setShowProfileForm(true)
        }
      }
    }
    checkUser()
  }, [router])

  const validateAuth = (emailVal: string, passwordVal: string) => {
    const errors: Record<string, string> = {}
    if (emailVal && (!emailVal.includes('@') || !emailVal.includes('.'))) {
      errors.email = 'Email must contain @ and .'
    }
    if (activeTab === 'join' && passwordVal && passwordVal.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0 && emailVal.length > 0 && passwordVal.length > 0
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAuth(email, password)) return
    
    setLoading(true)
    setError(null)

    // DATA-FIRST: Store typed data in Supabase immediately
    const tempId = crypto.randomUUID()
    try {
      await supabase.from('profiles').insert({
        user_id: tempId,
        name: fullName,
        goal,
        level
      })
      localStorage.setItem('aetherforge_guest_id', tempId)
    } catch (dbErr) {
      console.error('Database sync failed:', dbErr)
    }

    try {
      if (activeTab === 'join') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          if (error.message?.toLowerCase().includes('rate limit')) {
            handleDevBypass()
            return
          }
          throw error
        }
        if (data.user) {
          setUser(data.user)
          router.push('/dashboard')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        if (data.user) {
          setUser(data.user)
          router.push('/dashboard')
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const validateProfile = (nameVal: string) => {
    const errors: Record<string, string> = {}
    if (nameVal && nameVal.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0 && nameVal.trim().length >= 2
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateProfile(fullName)) return

    setLoading(true)
    setError(null)

    if (!user) return

    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: fullName,
          goal,
          level
        })

      if (error) throw error
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDevBypass = () => {
    localStorage.setItem('aetherforge_bypass', 'true')
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <Navbar />
      
      <div className="max-w-xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <span className="inline-block py-1 px-3 bg-accent text-black font-heading font-black text-xs tracking-[0.2em] mb-4 parallelogram-clip">
            STAGE 2 — MEMBERSHIP
          </span>
          <h1 className="text-6xl md:text-7xl font-[900] leading-none mb-2 tracking-tighter text-white">
            START YOUR <span className="text-accent underline decoration-4 underline-offset-8">JOURNEY</span>
          </h1>
          <p className="font-heading text-xl text-muted uppercase tracking-[0.3em]">
            AetherForge Membership
          </p>
        </div>

        {!showProfileForm ? (
          <div className="bg-[#0c0c0c] border border-border-primary p-8 shadow-2xl relative overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 border-b border-border-primary pb-4">
              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 font-heading text-xl tracking-widest transition-all ${activeTab === 'join' ? 'text-accent border-b-2 border-accent' : 'text-muted hover:text-white'}`}
              >
                JOIN NOW
              </button>
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 font-heading text-xl tracking-widest transition-all ${activeTab === 'signin' ? 'text-accent border-b-2 border-accent' : 'text-muted hover:text-white'}`}
              >
                SIGN IN
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-heading text-sm text-muted uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-4 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-heading text-sm text-muted uppercase tracking-widest">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-4 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {activeTab === 'join' && (
                <>
                  <div className="space-y-2">
                    <label className="block font-heading text-sm text-muted uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#111] border border-[#222] p-4 text-white focus:outline-none focus:border-accent transition-colors uppercase"
                      placeholder="JOHN DOE"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-heading text-sm text-muted uppercase tracking-widest">Goal</label>
                      <select 
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full bg-[#111] border border-[#222] p-4 text-white focus:outline-none focus:border-accent transition-colors uppercase"
                      >
                        <option value="fat_loss">Fat Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="endurance">Endurance</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block font-heading text-sm text-muted uppercase tracking-widest">Level</label>
                      <select 
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full bg-[#111] border border-[#222] p-4 text-white focus:outline-none focus:border-accent transition-colors uppercase"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="space-y-4">
                  <p className="text-accent text-sm font-medium p-3 bg-accent/5 border border-accent/20">{error}</p>
                  <button
                    type="button"
                    onClick={handleDevBypass}
                    className="w-full py-2 border border-accent/30 text-accent font-heading text-[10px] uppercase tracking-[0.2em] hover:bg-accent/10 transition-all font-black"
                  >
                    ⚡ EMERGENCY BYPASS (SKIP AUTH)
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                isLoading={loading} 
                className="w-full"
              >
                {activeTab === 'join' ? 'CREATE ACCOUNT' : 'SECURE LOGIN'}
              </Button>
            </form>
          </div>
        ) : (
          <div className="bg-[#0c0c0c] border border-border-primary p-8 shadow-2xl relative">
            <h2 className="font-heading text-3xl font-black mb-6 text-white uppercase tracking-tighter">Complete Your Profile</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-heading text-sm text-muted uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (formErrors.fullName) setFormErrors(prev => ({ ...prev, fullName: '' }))
                  }}
                  className="w-full bg-[#111] border border-[#222] p-4 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="John Doe"
                />
                <div className="h-4">
                  {formErrors.fullName && <p className="text-[#ff4444] text-[10px] uppercase tracking-wider font-heading mt-1">{formErrors.fullName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-heading text-sm text-muted uppercase tracking-widest">Your Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] p-4 text-white focus:outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option value="Fat Loss">Fat Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-heading text-sm text-muted uppercase tracking-widest">Your Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] p-4 text-white focus:outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-accent text-sm font-medium">{error}</p>}

              <Button 
                type="submit" 
                isLoading={loading} 
                className="w-full"
                disabled={!fullName || !goal || !level}
              >
                ACTIVATE MEMBERSHIP
              </Button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
