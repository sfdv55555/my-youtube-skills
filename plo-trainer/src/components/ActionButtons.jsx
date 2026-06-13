const ACTIONS = [
  {
    id: 'fold',
    label: 'Fold',
    sublabel: '0%',
    color: '#ef4444',
    hoverColor: '#dc2626',
    bg: 'rgba(239,68,68,0.15)',
    border: 'rgba(239,68,68,0.4)',
  },
  {
    id: 'call',
    label: 'Call 2BB',
    sublabel: '100%',
    color: '#22c55e',
    hoverColor: '#16a34a',
    bg: 'rgba(34,197,94,0.15)',
    border: 'rgba(34,197,94,0.4)',
  },
  {
    id: 'threebet',
    label: '3-Bet Pot',
    sublabel: '10.5BB',
    color: '#f97316',
    hoverColor: '#ea580c',
    bg: 'rgba(249,115,22,0.15)',
    border: 'rgba(249,115,22,0.4)',
  },
];

export default function ActionButtons({ onAction, disabled }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        width: '100%',
        maxWidth: 360,
      }}
    >
      {ACTIONS.map((a) => (
        <button
          key={a.id}
          onClick={() => !disabled && onAction(a.id)}
          disabled={disabled}
          style={{
            flex: 1,
            padding: '14px 4px',
            borderRadius: 12,
            border: `2px solid ${a.border}`,
            background: a.bg,
            color: a.color,
            fontWeight: 800,
            fontSize: 14,
            cursor: disabled ? 'default' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            opacity: disabled ? 0.5 : 1,
            transition: 'transform 0.1s, box-shadow 0.1s, background 0.15s',
            boxShadow: `0 4px 12px ${a.color}22`,
            WebkitTapHighlightColor: 'transparent',
          }}
          onPointerDown={(e) => {
            if (!disabled) e.currentTarget.style.transform = 'scale(0.96)';
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span style={{ fontSize: 14 }}>{a.label}</span>
          <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 600 }}>{a.sublabel}</span>
        </button>
      ))}
    </div>
  );
}
