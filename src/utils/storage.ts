/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatchStats, MatchSummary, ThemeId, SymbolSetId, GameMode, BoardSize, GameVariant, AiDifficulty } from '../types/game';

const STATS_KEY = 'super_tictactoe_stats_v1';
const PREFS_KEY = 'super_tictactoe_prefs_v1';

export interface UserPreferences {
  theme: ThemeId;
  symbols: SymbolSetId;
  soundEnabled: boolean;
  soundVolume: number;
  mode: GameMode;
  boardSize: BoardSize;
  variant: GameVariant;
  difficulty: AiDifficulty;
  timerSeconds: number; // 0 for off, 5, 10, 15
  playerXName: string;
  playerOName: string;
}

const defaultStats: MatchStats = {
  gamesPlayed: 0,
  xWins: 0,
  oWins: 0,
  draws: 0,
  currentStreakPlayer: null,
  currentStreakCount: 0,
  bestStreakPlayer: null,
  bestStreakCount: 0,
  fastestWinSeconds: null,
  history: [],
};

export const defaultPreferences: UserPreferences = {
  theme: 'obsidian',
  symbols: 'classic',
  soundEnabled: true,
  soundVolume: 0.6,
  mode: 'pve',
  boardSize: 3,
  variant: 'classic',
  difficulty: 'unbeatable',
  timerSeconds: 0,
  playerXName: 'Player 1',
  playerOName: 'Nexus AI',
};

export function getStoredStats(): MatchStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats;
    return { ...defaultStats, ...JSON.parse(raw) };
  } catch {
    return defaultStats;
  }
}

export function saveStoredStats(stats: MatchStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // safe fallback
  }
}

export function recordMatch(summary: MatchSummary): MatchStats {
  const current = getStoredStats();
  const next: MatchStats = {
    ...current,
    gamesPlayed: current.gamesPlayed + 1,
    history: [summary, ...current.history.slice(0, 49)], // keep last 50 matches
  };

  if (summary.winner === 'X') {
    next.xWins += 1;
    if (next.currentStreakPlayer === 'X') {
      next.currentStreakCount += 1;
    } else {
      next.currentStreakPlayer = 'X';
      next.currentStreakCount = 1;
    }
  } else if (summary.winner === 'O') {
    next.oWins += 1;
    if (next.currentStreakPlayer === 'O') {
      next.currentStreakCount += 1;
    } else {
      next.currentStreakPlayer = 'O';
      next.currentStreakCount = 1;
    }
  } else {
    next.draws += 1;
    next.currentStreakCount = 0;
    next.currentStreakPlayer = null;
  }

  // Update best streak
  if (next.currentStreakPlayer && next.currentStreakCount > next.bestStreakCount) {
    next.bestStreakCount = next.currentStreakCount;
    next.bestStreakPlayer = next.currentStreakPlayer;
  }

  // Fastest win
  if (summary.winner !== 'draw' && summary.durationSeconds > 0) {
    if (!next.fastestWinSeconds || summary.durationSeconds < next.fastestWinSeconds) {
      next.fastestWinSeconds = summary.durationSeconds;
    }
  }

  saveStoredStats(next);
  return next;
}

export function resetLifetimeStats(): MatchStats {
  saveStoredStats(defaultStats);
  return defaultStats;
}

export function getStoredPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return defaultPreferences;
    return { ...defaultPreferences, ...JSON.parse(raw) };
  } catch {
    return defaultPreferences;
  }
}

export function saveStoredPreferences(prefs: UserPreferences) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // safe fallback
  }
}
