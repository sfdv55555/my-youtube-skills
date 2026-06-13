import PlayingCard from './PlayingCard';

const POSITIONS_6MAX = [
  { label: 'UTG', angle: 270, isVillain: true },  // bottom, raiser
  { label: 'HJ',  angle: 330 },
  { label: 'CO',  angle: 30 },
  { label: 'BTN', angle: 90 },
  { label: 'SB',  angle: 150, folded: true },
  { label: 'BB',  angle: 210, isHero: true },
];

function positionToXY(angleDeg, rx, ry) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(rad) * rx, y: Math.sin(rad) * ry };
}

function PositionChip({ label, angle, isVillain, isHero, folded, pot }) {
  const { x, y } = positionToXY(angle, 115, 68);
  const stackLabel = isVillain ? '97 BB' : isHero ? '99 BB' : '100 BB';

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <div
        style={{
          padding: '3px 8px',
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 700,
          background: isVillain
            ? 'rgba(239,68,68,0.25)'
            : isHero
            ? 'rgba(16,185,129,0.25)'
            : folded
            ? 'rgba(100,116,139,0.2)'
            : 'rgba(255,255,255,0.08)',
          color: isVillain ? '#f87171' : isHero ? '#34d399' : folded ? '#64748b' : '#94a3b8',
          border: `1px solid ${
            isVillain ? '#f8717144' : isHero ? '#34d39944' : '#ffffff1a'
          }`,
          backdropFilter: 'blur(4px)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
        {isVillain && (
          <span style={{ marginLeft: 4, fontSize: 10, color: '#fbbf24' }}>↑3BB</span>
        )}
        {folded && (
          <span style={{ marginLeft: 4, fontSize: 10 }}>fold</span>
        )}
      </div>
      {!folded && (
        <div style={{ fontSize: 10, color: '#475569' }}>{stackLabel}</div>
      )}
    </div>
  );
}

export default function PokerTable({ cards, pot, phase }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {/* Table */}
      <div
        style={{
          position: 'relative',
          width: 320,
          height: 200,
          flexShrink: 0,
        }}
      >
        {/* Felt surface */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, #1a5c2e 0%, #0f3d1e 100%)',
            border: '3px solid #0d2e17',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.6)',
          }}
        />

        {/* Watermark */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.08)', fontWeight: 800, letterSpacing: 3 }}>
              PLO TRAINER
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Total pot: {pot} BB
            </div>
          </div>
        </div>

        {/* Dealer button */}
        <div
          style={{
            position: 'absolute',
            left: 'calc(50% + 88px)',
            top: 'calc(50% - 52px)',
            transform: 'translate(-50%, -50%)',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 800,
            color: '#0f172a',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            zIndex: 2,
          }}
        >
          D
        </div>

        {/* Position chips */}
        {POSITIONS_6MAX.map((pos) => (
          <PositionChip key={pos.label} {...pos} />
        ))}
      </div>

      {/* Hero cards label */}
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: 1 }}>
        YOUR HAND — BB vs UTG (100BB)
      </div>

      {/* Hero 4 cards */}
      <div style={{ display: 'flex', gap: 8 }}>
        {cards.map((c, i) => (
          <PlayingCard
            key={i}
            rank={c.rank}
            suit={c.suit}
            size="lg"
            animate={phase === 'quiz'}
          />
        ))}
      </div>
    </div>
  );
}
