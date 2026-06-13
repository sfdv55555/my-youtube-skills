// 4-color deck: spades=white, hearts=red, diamonds=blue, clubs=green
const SUIT_CONFIG = {
  s: { symbol: '♠', color: '#e2e8f0', bg: 'rgba(226,232,240,0.12)' },
  h: { symbol: '♥', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  d: { symbol: '♦', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  c: { symbol: '♣', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
};

export default function PlayingCard({ rank, suit, size = 'md', animate = false }) {
  const cfg = SUIT_CONFIG[suit] ?? SUIT_CONFIG.s;

  const sizes = {
    sm: { card: { width: 42, height: 58, borderRadius: 7, fontSize: 18, symbolSize: 12 } },
    md: { card: { width: 62, height: 84, borderRadius: 10, fontSize: 26, symbolSize: 16 } },
    lg: { card: { width: 76, height: 104, borderRadius: 12, fontSize: 32, symbolSize: 20 } },
  };
  const s = sizes[size] ?? sizes.md;

  return (
    <div
      style={{
        width: s.card.width,
        height: s.card.height,
        borderRadius: s.card.borderRadius,
        background: `linear-gradient(145deg, #1e293b, #0f172a)`,
        border: `2px solid ${cfg.color}44`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 12px ${cfg.color}22, 0 4px 12px rgba(0,0,0,0.5)`,
        position: 'relative',
        animation: animate ? 'cardDeal 0.3s ease-out' : 'none',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: s.card.fontSize,
          fontWeight: 800,
          color: cfg.color,
          lineHeight: 1,
          letterSpacing: -1,
          fontFamily: "'Georgia', serif",
        }}
      >
        {rank}
      </span>
      <span
        style={{
          fontSize: s.card.symbolSize,
          color: cfg.color,
          lineHeight: 1,
          marginTop: 2,
        }}
      >
        {cfg.symbol}
      </span>
    </div>
  );
}
