import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="font-display font-bold text-2xl tracking-[0.2em] text-white mb-6 block">
            FOUNTAINHEAD
          </Link>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            Berlin-based guitarist, producer, and mixing engineer. Pushing the boundaries of modern metal and instrumental music with fretless guitar mastery.
          </p>
          <div className="flex gap-4 mt-8">
            {/* Social Icons Placeholder */}
            {['Instagram', 'YouTube', 'Spotify', 'Facebook'].map(social => (
              <a key={social} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary transition-colors">
                <span className="sr-only">{social}</span>
                <div className="w-4 h-4 bg-current" style={{ maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\'/%3E%3C/svg%3E")', maskSize: 'cover' }}></div>
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-display tracking-widest text-white mb-6">SERVICES</h4>
          <ul className="space-y-4">
            <li><Link href="/quote" className="text-muted-foreground hover:text-primary transition-colors">Mixing & Mastering</Link></li>
            <li><Link href="/quote" className="text-muted-foreground hover:text-primary transition-colors">Production</Link></li>
            <li><Link href="/book" className="text-muted-foreground hover:text-primary transition-colors">Guitar Lessons</Link></li>
            <li><Link href="/book" className="text-muted-foreground hover:text-primary transition-colors">Creative Coaching</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display tracking-widest text-white mb-6">QUICK LINKS</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Tom</Link></li>
            <li><Link href="/discography" className="text-muted-foreground hover:text-primary transition-colors">Discography</Link></li>
            <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">Merch Store</Link></li>
            <li><Link href="/portal" className="text-muted-foreground hover:text-primary transition-colors">Student Portal</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground/50">
        <p>&copy; {new Date().getFullYear()} Fountainhead. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
