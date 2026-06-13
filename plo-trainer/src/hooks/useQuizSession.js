import { useState, useCallback, useRef } from 'react';
import { HANDS, generateCards, SCORING } from '../data/handsDB';

function pickHand(excludeId) {
  let filtered = HANDS.filter((h) => h.id !== excludeId);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function getStreakMultiplier(streak) {
  for (const { minStreak, multiplier, label } of SCORING.streakMultipliers) {
    if (streak >= minStreak) return { multiplier, label };
  }
  return { multiplier: 1, label: '' };
}

export function useQuizSession() {
  const lastHandId = useRef(null);

  const [session, setSession] = useState(() => {
    const hand = pickHand(null);
    lastHandId.current = hand.id;
    return {
      hand,
      cards: generateCards(hand),
      phase: 'quiz',  // 'quiz' | 'feedback'
      userAction: null,
      isCorrect: false,
      pointsEarned: 0,

      // stats
      handsPlayed: 0,
      correct: 0,
      inaccuracies: 0,
      mistakes: 0,
      streak: 0,
      bestStreak: 0,
      totalPoints: 0,
      xp: 0,

      // history (last 10)
      history: [],
    };
  });

  const submitAction = useCallback((action) => {
    setSession((prev) => {
      if (prev.phase !== 'quiz') return prev;
      const { hand, streak, totalPoints, history } = prev;
      const { frequencies, correctAction } = hand;

      const isPrimary = action === correctAction;
      const secondaryFreq = frequencies[action] ?? 0;
      const isMixed = !isPrimary && secondaryFreq >= 20;

      let pointsEarned = 0;
      let isCorrect = false;
      let streakDelta = 0;

      if (isPrimary) {
        isCorrect = true;
        streakDelta = 1;
        const { multiplier } = getStreakMultiplier(streak + 1);
        pointsEarned = Math.round(SCORING.primaryCorrect * multiplier);
      } else if (isMixed) {
        isCorrect = true;
        streakDelta = 1;
        const { multiplier } = getStreakMultiplier(streak + 1);
        pointsEarned = Math.round(SCORING.mixedClose * multiplier);
      } else {
        isCorrect = false;
        streakDelta = -streak; // reset
      }

      const newStreak = Math.max(0, streak + streakDelta);
      const newBestStreak = Math.max(prev.bestStreak, newStreak);
      const newTotalPoints = totalPoints + pointsEarned;

      const historyEntry = {
        hand: hand.name,
        userAction: action,
        correctAction,
        isCorrect,
        isPrimary,
        isMixed,
        ev: hand.ev[action],
        bestEv: hand.ev[correctAction],
      };

      return {
        ...prev,
        phase: 'feedback',
        userAction: action,
        isCorrect,
        pointsEarned,
        streak: newStreak,
        bestStreak: newBestStreak,
        totalPoints: newTotalPoints,
        xp: newTotalPoints,
        handsPlayed: prev.handsPlayed + 1,
        correct: prev.correct + (isPrimary ? 1 : 0),
        inaccuracies: prev.inaccuracies + (isMixed ? 1 : 0),
        mistakes: prev.mistakes + (!isPrimary && !isMixed ? 1 : 0),
        history: [historyEntry, ...history].slice(0, 10),
      };
    });
  }, []);

  const nextHand = useCallback(() => {
    setSession((prev) => {
      const hand = pickHand(lastHandId.current);
      lastHandId.current = hand.id;
      return {
        ...prev,
        hand,
        cards: generateCards(hand),
        phase: 'quiz',
        userAction: null,
        isCorrect: false,
        pointsEarned: 0,
      };
    });
  }, []);

  const resetSession = useCallback(() => {
    const hand = pickHand(null);
    lastHandId.current = hand.id;
    setSession({
      hand,
      cards: generateCards(hand),
      phase: 'quiz',
      userAction: null,
      isCorrect: false,
      pointsEarned: 0,
      handsPlayed: 0,
      correct: 0,
      inaccuracies: 0,
      mistakes: 0,
      streak: 0,
      bestStreak: 0,
      totalPoints: 0,
      xp: 0,
      history: [],
    });
  }, []);

  const accuracyPct =
    session.handsPlayed > 0
      ? Math.round((session.correct / session.handsPlayed) * 100)
      : 0;

  return { session, submitAction, nextHand, resetSession, accuracyPct };
}
