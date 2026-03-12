const PRIMARY = "#C4935A";
const PRIMARY_DIM = "#a07a49";
const SECONDARY = "#D5B584";
const BG = "#100F0D";
const CARD = "#18160f";
const FG = "#EAEAEA";
const MUTED = "#888880";

export function AmberCopper() {
  return (
    <div style={{ background: BG, color: FG, fontFamily: "Inter, sans-serif", minHeight: "100vh", overflow: "hidden" }}>

      {/* Navbar */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: `1px solid rgba(213,181,132,0.1)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${PRIMARY}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: PRIMARY, opacity: 0.7 }} />
          </div>
          <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 15, letterSpacing: "0.2em", color: FG }}>FOUNTAINHEAD</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["About", "Discography", "Services", "Shop", "Book"].map(l => (
            <span key={l} style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", padding: "70px 48px 60px", textAlign: "center", overflow: "hidden" }}>
        {/* Ambient glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: `radial-gradient(ellipse, ${PRIMARY}22 0%, transparent 70%)`, pointerEvents: "none" }} />

        <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: PRIMARY, marginBottom: 20, fontWeight: 500 }}>Berlin · Guitar · Production · Mixing</p>

        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 62, fontWeight: 700, lineHeight: 1.05, letterSpacing: "0.06em", textTransform: "uppercase", color: FG, margin: "0 0 8px" }}>
          Mastering the
        </h1>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 62, fontWeight: 700, lineHeight: 1.05, letterSpacing: "0.06em", textTransform: "uppercase", background: `linear-gradient(135deg, ${PRIMARY_DIM}, ${PRIMARY}, #e0b07a)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>
          Fretless
        </h1>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 62, fontWeight: 700, lineHeight: 1.05, letterSpacing: "0.06em", textTransform: "uppercase", color: FG, margin: "0 0 28px" }}>
          Dimension
        </h1>

        <p style={{ fontSize: 16, color: MUTED, marginBottom: 40, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 40px" }}>
          Berlin-based virtuoso guitarist, producer, and mixing engineer. Pushing boundaries in modern metal.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button style={{ background: PRIMARY, color: BG, border: "none", padding: "14px 32px", fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
            Hire for Production
          </button>
          <button style={{ background: "transparent", color: FG, border: `1px solid ${SECONDARY}40`, padding: "14px 32px", fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
            Book a Lesson
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${PRIMARY}40, transparent)`, margin: "0 48px" }} />

      {/* Color swatch strip */}
      <div style={{ display: "flex", gap: 12, padding: "24px 48px", alignItems: "center" }}>
        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>Palette</span>
        {[BG, FG, PRIMARY, SECONDARY].map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 28, height: 28, background: c, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2 }} />
            <span style={{ fontSize: 10, color: MUTED, letterSpacing: "0.05em" }}>{c}</span>
          </div>
        ))}
      </div>

      {/* Mini testimonial card sample */}
      <div style={{ padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          { name: "A. Schulz", role: "Metal Guitarist", quote: "Tom's production took our album to a completely new level." },
          { name: "K. Müller", role: "Producer", quote: "Best mixing engineer in Berlin. Period." },
          { name: "J. Braun", role: "Student", quote: "Lessons with Tom changed my entire approach to guitar." },
        ].map((t, i) => (
          <div key={i} style={{ background: CARD, border: `1px solid rgba(196,147,90,0.12)`, padding: "20px", position: "relative" }}>
            <div style={{ fontSize: 28, color: `${PRIMARY}30`, fontFamily: "Georgia, serif", position: "absolute", top: 12, left: 16, lineHeight: 1 }}>"</div>
            <p style={{ fontSize: 12, color: `${FG}bb`, fontStyle: "italic", marginBottom: 12, paddingTop: 16, lineHeight: 1.6 }}>{t.quote}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${PRIMARY}22`, display: "flex", alignItems: "center", justifyContent: "center", color: PRIMARY, fontWeight: 700, fontSize: 12, fontFamily: "'Cinzel', serif" }}>{t.name[0]}</div>
              <div>
                <div style={{ fontSize: 11, color: FG, fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 10, color: PRIMARY, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
