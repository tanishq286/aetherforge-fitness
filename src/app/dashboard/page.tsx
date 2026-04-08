'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

interface Profile {
  name: string
  goal: string
  level: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/membership')
        return
      }
      setUser(user)

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, goal, level')
          .eq('user_id', user.id)
          .single()

        if (error || !data) {
          console.warn('Profile sync issue:', error)
          router.push('/membership')
          return
        }

        setProfile(data)
      } catch (err) {
        console.error('Critical dashboard error:', err)
        router.push('/membership')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-heading">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
        <p className="text-accent tracking-[0.5em] animate-pulse">SYNCHRONIZING PROFILE...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <Navbar />

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-accent font-heading font-black text-sm tracking-[0.3em] uppercase block mb-2">
              System Access // Authenticated
            </span>
            <h1 className="text-6xl md:text-8xl font-[900] text-white leading-none tracking-tighter uppercase">
              Welcome, <br />
              <span className="text-accent italic">{profile?.name.split(' ')[0]}</span>
            </h1>
          </div>

          <button 
            onClick={handleSignOut}
            className="font-heading font-bold text-sm tracking-widest text-[#666] hover:text-accent transition-colors uppercase border-b border-transparent hover:border-accent pb-1"
          >
            Terminal Logout
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Core Card */}
          <div className="md:col-span-2 bg-[#0c0c0c] border border-border-primary p-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-50 shadow-[0_0_15px_rgba(255,77,0,0.5)]" />
            <h2 className="font-heading text-2xl font-black mb-10 text-white tracking-widest uppercase">Performance Index</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-1">
                <p className="text-[#444] font-heading text-xs tracking-widest uppercase">Target Objective</p>
                <p className="text-3xl font-heading font-black text-white italic tracking-tight">{profile?.goal}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#444] font-heading text-xs tracking-widest uppercase">Experience Level</p>
                <p className="text-3xl font-heading font-black text-white italic tracking-tight">{profile?.level}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#444] font-heading text-xs tracking-widest uppercase">Account ID</p>
                <p className="text-sm font-mono text-[#666] truncate">{user?.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#444] font-heading text-xs tracking-widest uppercase">Membership Status</p>
                <p className="text-sm font-heading font-bold text-accent uppercase tracking-widest">Active // Protocol A1</p>
              </div>
            </div>
          </div>

          {/* Quick Actions / Stats Card */}
          <div className="bg-[#0c0c0c] border border-border-primary p-10 flex flex-col justify-between group hover:border-accent/20 transition-all">
            <div>
              <h2 className="font-heading text-2xl font-black mb-6 text-white tracking-widest uppercase">Next Phase</h2>
              <p className="text-muted leading-relaxed mb-8">
                Your neural-strength profile indicates readiness for the next conditioning cycle.
              </p>
            </div>
            
            <Button className="w-full">
              Begin Workout
            </Button>
          </div>
        </div>

        {/* Secondary Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Neural Load', value: '88%', status: 'Stable' },
            { label: 'Metabolism', value: 'OPTIMAL', status: 'In-Range' },
            { label: 'Hydration', value: 'CHECK', status: 'Warning' },
            { label: 'Intensity', value: 'MAX', status: 'Active' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#080808] border border-border-primary p-6 flex flex-col items-center text-center">
              <span className="text-[10px] font-heading font-black text-[#333] tracking-[0.3em] uppercase mb-2">{stat.label}</span>
              <span className={`text-2xl font-heading font-black ${stat.status === 'Warning' ? 'text-accent' : 'text-white'}`}>{stat.value}</span>
              <span className={`text-[9px] font-heading uppercase mt-2 tracking-widest ${stat.status === 'Warning' ? 'text-accent' : 'text-[#555]'}`}>{stat.status}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
