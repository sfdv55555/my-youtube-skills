import { getLevel, getNextLevel, SCORING } from '../data/handsDB';

function StatBox({ label, value, color }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        flex: 1,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 800, color: color ?? '#f1f5f9' }}>{value}</div>
      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textAlign: 'center' }}>
        {label}
      </div>
    </div>
  );
}

function StreakIndicator({ streak }) {
  const { label } = SCORING.streakMultipliers.find((s) => streak >= s.minStreak) ?? {};
  return label ? (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: '#fbbf24',
        animation: 'pulse 1s ease-in-out infinite',
      }}
    >
      {label}
    </div>
  ) : null;
}

export default function StatsPanel({ session, accuracyPct }) {
  const level = getLevel(session.xp);
  const nextLevel = getNextLevel(session.xp);
  const xpProgress = nextLevel
    ? Math.round(((session.xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100)
    : 100;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 380,
        background: 'rgba(15,23,42,0.8)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 16px',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Level + XP bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: level.color }}>{level.name}</span>
          <span style={{ fontSize: 11, color: '#475569' }}>
            {session.xp} XP{nextLevel ? ` / ${nextLevel.minXP}` : ''}
          </span>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${xpProgress}%`,
              background: `linear-gradient(90deg, ${level.color}, ${nextLevel?.color ?? level.color})`,
              borderRadius: 2,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <StatBox label="Hands" value={session.handsPlayed} />
        <StatBox
          label="Accuracy"
          value={`${accuracyPct}%`}
          color={accuracyPct >= 70 ? '#22c55e' : accuracyPct >= 50 ? '#fbbf24' : '#f87171'}
        />
        <StatBox label="Streak" value={session.streak} color="#f97316" />
        <StatBox label="Points" value={session.totalPoints} color="#a78bfa" />
      </div>

      {/* Feedback counters */}
      <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
        <span style={{ color: '#22c55e' }}>✔ {session.correct}</span>
        <span style={{ color: '#fbbf24' }}>~ {session.inaccuracies}</span>
        <span style={{ color: '#f87171' }}>✗ {session.mistakes}</span>
        <span style={{ color: '#f97316' }}>Best: {session.bestStreak}</span>
      </div>

      {session.streak >= 3 && (
        <div style={{ marginTop: 6 }}>
          <StreakIndicator streak={session.streak} />
        </div>
      )}
    </div>
  );
}
