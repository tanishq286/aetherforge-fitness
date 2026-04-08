import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 flex flex-col items-center">
          <span className="inline-block py-1 px-4 bg-accent/10 border border-accent/20 text-accent font-heading font-black text-sm tracking-[0.3em] mb-6 uppercase">
            Elite Performance Facility
          </span>

          <h1 className="text-7xl md:text-[9rem] font-[900] leading-[0.8] mb-8 tracking-tighter text-white uppercase italic select-none">
            Aether<br/>
            <span className="text-accent underline decoration-8 underline-offset-10">Forge</span>
          </h1>

          <p className="max-w-2xl text-muted text-xl md:text-2xl font-body font-light mb-12 uppercase tracking-wide leading-relaxed">
            High-fidelity physical engineering for the <span className="text-white font-medium">uncompromising athlete</span>. 
            Forge your legacy in the dark.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/membership">
              <Button>Initalize Access</Button>
            </Link>
            <Button variant="outline">View Facility</Button>
          </div>
        </div>
      </section>

      {/* Concept Grid */}
      <section className="pb-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Neuro-Strength", desc: "Adaptive neural feedback loops for maximum force production and CNS optimization." },
          { title: "Metabolic Core", desc: "Precision nutrition and metabolic tracking for sustained elite performance." },
          { title: "Hyper-Recov", desc: "Advanced regenerative protocols including cryo-thermal and pneumatic compression." }
        ].map((feat, idx) => (
          <div key={idx} className="bg-[#0c0c0c] border border-border-primary p-10 relative group transition-all hover:border-accent/30 overflow-hidden">
            <div className="absolute -top-4 -right-4 font-heading font-black text-8xl text-accent/5 transition-all group-hover:text-accent/10 select-none">
              0{idx + 1}
            </div>
            <h3 className="font-heading text-3xl font-black mb-4 group-hover:text-accent transition-colors">
              {feat.title}
            </h3>
            <p className="text-muted text-lg leading-relaxed relative z-10">
              {feat.desc}
            </p>
            <div className="mt-8 w-12 h-1 bg-accent/20 group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </section>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-border-primary text-center">
        <p className="font-heading text-muted tracking-[0.5em] text-xs uppercase">
          &copy; 2026 AetherForge Fitness // All Rights Reserved
        </p>
      </footer>
    </main>
  )
}
