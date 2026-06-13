import { useState } from 'react';
import PokerTable from './components/PokerTable';
import ActionButtons from './components/ActionButtons';
import StatsPanel from './components/StatsPanel';
import FeedbackModal from './components/FeedbackModal';
import { useQuizSession } from './hooks/useQuizSession';
import { SCENARIO } from './data/handsDB';

function WelcomeScreen({ onStart }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        padding: 24,
        gap: 24,
        textAlign: 'center',
      }}
    >
      <div>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🃏</div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #34d399, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 4,
          }}
        >
          4-Card PLO Trainer
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 0 }}>GTO-based preflop quiz</p>
      </div>

      <div
        style={{
          background: 'rgba(15,23,42,0.8)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '20px 24px',
          maxWidth: 320,
          width: '100%',
          textAlign: 'left',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          Scenario
        </div>
        {[
          ['Format', '6-Max Cash Game'],
          ['Stack Depth', '100 Big Blinds'],
          ['Your Position', 'Big Blind (BB)'],
          ['Villain', 'UTG raises pot (3BB)'],
          ['Pot to you', '4.5 BB'],
          ['Your decision', 'Fold / Call 2BB / 3-Bet to 10.5BB'],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 8,
              marginBottom: 8,
              fontSize: 13,
            }}
          >
            <span style={{ color: '#475569', flexShrink: 0 }}>{k}</span>
            <span style={{ color: '#e2e8f0', textAlign: 'right', fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          background: 'rgba(15,23,42,0.6)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '14px 20px',
          maxWidth: 320,
          width: '100%',
          fontSize: 12,
          color: '#475569',
          lineHeight: 1.6,
          textAlign: 'left',
        }}
      >
        <strong style={{ color: '#64748b' }}>How scoring works:</strong>
        <br />✓ Primary GTO action → +10 pts<br />
        ~ Mixed hand, close action → +5 pts<br />
        ✗ Wrong → 0 pts + streak reset<br />
        🔥 Streak bonuses: 3×→1.5×, 5×→2×, 10×→3×
      </div>

      <button
        onClick={onStart}
        style={{
          width: '100%',
          maxWidth: 320,
          padding: '18px',
          borderRadius: 14,
          border: 'none',
          background: 'linear-gradient(135deg, #059669, #1d4ed8)',
          color: '#fff',
          fontWeight: 800,
          fontSize: 18,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(5,150,105,0.3)',
          letterSpacing: 0.5,
        }}
      >
        Start Training ▶
      </button>

      <p style={{ fontSize: 11, color: '#334155', marginTop: -8 }}>
        Data sourced from MonkerSolver PLO GTO solutions
      </p>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const { session, submitAction, nextHand, resetSession, accuracyPct } = useQuizSession();

  if (!started) {
    return <WelcomeScreen onStart={() => setStarted(true)} />;
  }

  const showFeedback = session.phase === 'feedback';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100dvh',
        padding: '12px 12px 24px',
        gap: 14,
        maxWidth: 480,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#34d399' }}>PLO Trainer</span>
          <span
            style={{
              marginLeft: 8,
              fontSize: 11,
              color: '#475569',
              background: 'rgba(255,255,255,0.05)',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            4-Card · BB vs UTG
          </span>
        </div>
        <button
          onClick={resetSession}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#64748b',
            borderRadius: 8,
            padding: '5px 10px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      {/* Stats panel */}
      <StatsPanel session={session} accuracyPct={accuracyPct} />

      {/* Scenario chip */}
      <div
        style={{
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.25)',
          borderRadius: 8,
          padding: '6px 14px',
          fontSize: 12,
          color: '#93c5fd',
          fontWeight: 600,
        }}
      >
        UTG raises to 3BB → SB folds → BB to act (pot: 4.5 BB)
      </div>

      {/* Poker table + cards */}
      <PokerTable
        cards={session.cards}
        pot={SCENARIO.potFacingDecision}
        phase={session.phase}
      />

      {/* Action buttons */}
      <ActionButtons onAction={submitAction} disabled={showFeedback} />

      {/* Tap to see feedback hint */}
      {!showFeedback && (
        <div style={{ fontSize: 11, color: '#1e3a5f', marginTop: -4 }}>
          What's your action with this hand?
        </div>
      )}

      {/* Hand history */}
      {session.history.length > 0 && (
        <div
          style={{
            width: '100%',
            maxWidth: 380,
            background: 'rgba(15,23,42,0.6)',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '10px 14px',
          }}
        >
          <div style={{ fontSize: 11, color: '#334155', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Recent Hands
          </div>
          {session.history.slice(0, 5).map((h, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                fontSize: 12,
              }}
            >
              <span style={{ color: '#475569' }}>{h.hand}</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ color: '#334155', fontSize: 11 }}>
                  {h.userAction === 'fold' ? 'Fold' : h.userAction === 'call' ? 'Call' : '3-Bet'}
                </span>
                <span style={{ fontSize: 14, color: h.isCorrect ? '#22c55e' : '#ef4444' }}>
                  {h.isCorrect ? '✓' : '✗'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback modal */}
      {showFeedback && (
        <FeedbackModal
          hand={session.hand}
          cards={session.cards}
          userAction={session.userAction}
          isCorrect={session.isCorrect}
          pointsEarned={session.pointsEarned}
          streak={session.streak}
          onNext={nextHand}
        />
      )}
    </div>
  );
}
