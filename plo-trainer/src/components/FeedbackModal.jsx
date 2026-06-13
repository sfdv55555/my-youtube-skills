import PlayingCard from './PlayingCard';

const ACTION_LABELS = {
  fold: 'Fold',
  call: 'Call 2BB',
  threebet: '3-Bet Pot',
};

const ACTION_COLORS = {
  fold: '#ef4444',
  call: '#22c55e',
  threebet: '#f97316',
};

function EVBar({ ev, action, isUser, isCorrect }) {
  const maxEV = 2.5;
  const pct = Math.min(100, Math.max(0, ((ev + 1) / (maxEV + 1)) * 100));
  const color = ACTION_COLORS[action] ?? '#64748b';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <div
        style={{
          width: 72,
          fontSize: 11,
          fontWeight: isUser ? 700 : 500,
          color: isUser ? color : '#64748b',
          flexShrink: 0,
        }}
      >
        {ACTION_LABELS[action]}
      </div>
      <div
        style={{
          flex: 1,
          height: 16,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 4,
          overflow: 'hidden',
          border: isUser ? `1px solid ${color}66` : '1px solid transparent',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: isUser ? color : `${color}44`,
            borderRadius: 4,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <div
        style={{
          width: 48,
          fontSize: 11,
          fontWeight: isUser ? 700 : 400,
          color: isUser ? color : '#475569',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {ev > 0 ? '+' : ''}{ev.toFixed(2)} BB
      </div>
    </div>
  );
}

function FreqBar({ freq, action, isCorrect }) {
  const color = ACTION_COLORS[action] ?? '#64748b';
  const isHigh = freq >= 50;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <div style={{ width: 72, fontSize: 10, color: '#475569', flexShrink: 0 }}>
        {ACTION_LABELS[action]}
      </div>
      <div
        style={{
          flex: 1,
          height: 10,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${freq}%`,
            background: isHigh ? color : `${color}66`,
            borderRadius: 3,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <div style={{ width: 36, fontSize: 10, color: '#64748b', textAlign: 'right', flexShrink: 0 }}>
        {freq}%
      </div>
    </div>
  );
}

export default function FeedbackModal({
  hand,
  cards,
  userAction,
  isCorrect,
  pointsEarned,
  streak,
  onNext,
}) {
  const { frequencies, ev, correctAction, explanation, name, category } = hand;

  const resultColor = isCorrect ? '#22c55e' : '#ef4444';
  const resultLabel = isCorrect
    ? userAction === correctAction
      ? 'Correct!'
      : 'Close enough!'
    : 'Mistake';

  const categoryBadgeColors = {
    premium: '#f59e0b',
    strong: '#22c55e',
    medium: '#3b82f6',
    marginal: '#f97316',
    trash: '#64748b',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(4px)',
        padding: 0,
      }}
      onClick={onNext}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'linear-gradient(180deg, #0f172a 0%, #0a0e1a 100%)',
          borderRadius: '24px 24px 0 0',
          border: `1px solid ${resultColor}33`,
          borderBottom: 'none',
          padding: '20px 20px 32px',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Result header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${resultColor}22`,
                border: `2px solid ${resultColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              {isCorrect ? '✓' : '✗'}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: resultColor }}>
                {resultLabel}
              </div>
              <div style={{ fontSize: 11, color: '#475569' }}>
                {userAction !== correctAction
                  ? `GTO: ${ACTION_LABELS[correctAction]}`
                  : 'GTO primary action'}
              </div>
            </div>
          </div>
          {pointsEarned > 0 && (
            <div
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: 'rgba(167,139,250,0.15)',
                border: '1px solid rgba(167,139,250,0.3)',
                color: '#a78bfa',
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              +{pointsEarned} pts
            </div>
          )}
        </div>

        {/* Hand name + category badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          {/* Mini cards */}
          <div style={{ display: 'flex', gap: 4 }}>
            {cards.map((c, i) => (
              <PlayingCard key={i} rank={c.rank} suit={c.suit} size="sm" />
            ))}
          </div>
          <div
            style={{
              padding: '3px 8px',
              borderRadius: 6,
              background: `${categoryBadgeColors[category]}22`,
              border: `1px solid ${categoryBadgeColors[category]}55`,
              color: categoryBadgeColors[category],
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {category}
          </div>
        </div>

        {/* EV chart */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            EV (Big Blinds)
          </div>
          {['fold', 'call', 'threebet'].map((action) => (
            <EVBar
              key={action}
              action={action}
              ev={ev[action]}
              isUser={action === userAction}
              isCorrect={action === correctAction}
            />
          ))}
        </div>

        {/* GTO frequency chart */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            GTO Frequencies
          </div>
          {['fold', 'call', 'threebet'].map((action) => (
            <FreqBar
              key={action}
              action={action}
              freq={frequencies[action] ?? 0}
              isCorrect={action === correctAction}
            />
          ))}
        </div>

        {/* Explanation */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 10,
            padding: '10px 12px',
            fontSize: 12,
            color: '#94a3b8',
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          {explanation}
        </div>

        {/* Next hand button */}
        <button
          onClick={onNext}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 16,
            cursor: 'pointer',
            letterSpacing: 0.5,
            boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
          }}
        >
          Next Hand →
        </button>
      </div>
    </div>
  );
}
