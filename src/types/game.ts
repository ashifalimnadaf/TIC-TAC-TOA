/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Player = 'X' | 'O';

export type BoardSize = 3 | 4 | 5;

export type GameMode = 'pve' | 'pvp';

export type AiDifficulty = 'easy' | 'medium' | 'unbeatable';

export type AiSpeed = 'ultra' | 'fast' | 'normal'; // ultra ~ 80ms, fast ~ 200ms, normal ~ 450ms

export type GameVariant = 'classic' | 'infinity'; // In infinity mode, each player can only have BoardSize marks! Oldest fades.

export type ThemeId = 'obsidian' | 'arcade' | 'monochrome' | 'emerald';

export type SymbolSetId = 'classic' | 'cyber' | 'elements' | 'celestial' | 'weapons';

export type SeriesLength = 1 | 3 | 5;

export interface WinLine {
  indices: number[];
  direction: 'horizontal' | 'vertical' | 'diagonal-main' | 'diagonal-anti';
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'draw';

export interface MoveRecord {
  index: number;
  player: Player;
  moveNumber: number;
  timeRemaining?: number;
}

export interface PlayerProfile {
  name: string;
  symbol: Player;
  avatar: string;
  customSymbolLabel?: string;
  accentColor: string;
}

export interface MatchStats {
  gamesPlayed: number;
  xWins: number;
  oWins: number;
  draws: number;
  currentStreakPlayer: Player | null;
  currentStreakCount: number;
  bestStreakPlayer: Player | null;
  bestStreakCount: number;
  fastestWinSeconds: number | null;
  history: MatchSummary[];
}

export interface MatchSummary {
  id: string;
  date: string;
  winner: Player | 'draw';
  winnerName: string;
  boardSize: BoardSize;
  totalMoves: number;
  durationSeconds: number;
  variant: GameVariant;
  mode: GameMode;
  aiDifficulty?: AiDifficulty;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bodyBg: string;
  cardBg: string;
  cardBorder: string;
  gridBg: string;
  cellBg: string;
  cellHover: string;
  accentX: string;
  accentO: string;
  accentXGlow: string;
  accentOGlow: string;
  primaryButton: string;
  highlightText: string;
}

export interface SymbolPack {
  id: SymbolSetId;
  name: string;
  xLabel: string;
  oLabel: string;
  xIconName: string;
  oIconName: string;
}
