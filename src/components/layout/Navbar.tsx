import Link from 'next/link'

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-primary bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Orange Diamond Logo */}
          <div className="w-6 h-6 bg-accent rotate-45 transform transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(255,77,0,0.4)]" />
          <span className="font-heading font-[900] text-2xl tracking-tighter text-text-primary">
            AETHER<span className="text-accent uppercase">Forge</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading font-bold text-sm tracking-widest hover:text-accent transition-colors uppercase">
            Home
          </Link>
          <Link href="/membership" className="font-heading font-bold text-sm tracking-widest text-accent uppercase">
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  )
}
