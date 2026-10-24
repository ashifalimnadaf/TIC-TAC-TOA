/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Player, ThemeConfig, GameMode, BoardSize, GameVariant, AiDifficulty, SymbolSetId } from '../types/game';
import { MarkIcon } from './MarkIcon';
import { Bot, User, Flame, Clock, Brain } from 'lucide-react';
import { motion } from 'motion/react';

interface ScoreBoardProps {
  theme: ThemeConfig;
  symbolSet: SymbolSetId;
  currentPlayer: Player;
  gameMode: GameMode;
  boardSize: BoardSize;
  variant: GameVariant;
  difficulty: AiDifficulty;
  playerXName: string;
  playerOName: string;
  scoreX: number;
  scoreO: number;
  draws: number;
  roundNumber: number;
  seriesGoal: number; // e.g. 1, 3, 5
  timeRemaining?: number;
  maxTurnTime?: number;
  isAiThinking: boolean;
  activeStreakCount: number;
  activeStreakPlayer: Player | null;
  xMarkCount?: number;
  oMarkCount?: number;
  aiBrainLevel?: number;
  onOpenBrain?: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  theme,
  symbolSet,
  currentPlayer,
  gameMode,
  boardSize,
  variant,
  difficulty,
  playerXName,
  playerOName,
  scoreX,
  scoreO,
  draws,
  roundNumber,
  seriesGoal,
  timeRemaining,
  maxTurnTime,
  isAiThinking,
  activeStreakCount,
  activeStreakPlayer,
  xMarkCount = 0,
  oMarkCount = 0,
  aiBrainLevel,
  onOpenBrain,
}) => {
  const isXTurn = currentPlayer === 'X';
  const isOTurn = currentPlayer === 'O';

  // Format unboxed metadata
  const modeLabel = gameMode === 'pve' ? `AI (${difficulty.toUpperCase()})` : 'Pass & Play';
  const variantLabel = variant === 'infinity' ? 'Infinity Mode (Max 3 Pieces)' : `Classic ${boardSize}×${boardSize}`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Clean Unboxed Metadata Line */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-2 font-medium">
        <div className="flex items-center gap-2">
          <span>{variantLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{modeLabel}</span>
          {seriesGoal > 1 && (
            <>
              <span aria-hidden="true">·</span>
              <span>First to {Math.ceil(seriesGoal / 2)} wins</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono-numbers">
          {activeStreakCount > 1 && activeStreakPlayer && (
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Flame size={13} className="text-amber-400 fill-amber-400" />
              <span>{activeStreakCount}x Streak ({activeStreakPlayer})</span>
            </span>
          )}
          {activeStreakCount > 1 && activeStreakPlayer && <span aria-hidden="true">·</span>}
          <span>Round {roundNumber}</span>
          <span aria-hidden="true">·</span>
          <span>{draws} Draws</span>
        </div>
      </div>

      {/* Main Duel HUD Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-stretch">
        {/* Player X HUD Card */}
        <div
          className={`md:col-span-3 rounded-xl p-4 transition-all duration-300 relative border ${
            isXTurn
              ? `${theme.cardBg} ${theme.accentXGlow} ring-1 ring-cyan-400/50`
              : `${theme.cardBg} ${theme.cardBorder} opacity-75`
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <User size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">{playerXName}</h3>
                  {isXTurn && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                      Turn
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                  <span className="text-cyan-400 font-semibold">Mark:</span>
                  <MarkIcon player="X" symbolSet={symbolSet} size={14} animate={false} />
                  {variant === 'infinity' && (
                    <span className="text-[11px] text-slate-400 font-mono-numbers">
                      ({xMarkCount}/{boardSize})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-mono-numbers text-white">{scoreX}</span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Wins</span>
            </div>
          </div>

          {/* Turn timer progress bar if blitz mode */}
          {isXTurn && maxTurnTime && maxTurnTime > 0 && timeRemaining !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-cyan-300 mb-1 font-mono-numbers">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> Turn Clock
                </span>
                <span className={timeRemaining <= 3 ? 'text-rose-400 font-bold animate-pulse' : ''}>
                  {timeRemaining}s
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${timeRemaining <= 3 ? 'bg-rose-500' : 'bg-cyan-400'}`}
                  initial={false}
                  animate={{ width: `${(timeRemaining / maxTurnTime) * 100}%` }}
                  transition={{ ease: 'linear', duration: 0.2 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Center VS Indicator */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-1">
          <div className="text-xs font-bold tracking-widest text-slate-500 uppercase font-mono-numbers">
            VS
          </div>
          <div className="text-[11px] text-slate-400 font-mono-numbers mt-0.5">
            {scoreX} - {scoreO}
          </div>
        </div>

        {/* Player O HUD Card */}
        <div
          className={`md:col-span-3 rounded-xl p-4 transition-all duration-300 relative border ${
            isOTurn
              ? `${theme.cardBg} ${theme.accentOGlow} ring-1 ring-rose-400/50`
              : `${theme.cardBg} ${theme.cardBorder} opacity-75`
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                {gameMode === 'pve' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">{playerOName}</h3>
                  {isOTurn && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.5 rounded">
                      {isAiThinking ? 'Thinking...' : 'Turn'}
                    </span>
                  )}
                  {gameMode === 'pve' && aiBrainLevel && (
                    <button
                      type="button"
                      onClick={onOpenBrain}
                      className="flex items-center gap-1 text-[10px] font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-800/70 px-1.5 py-0.5 rounded hover:bg-cyan-900/60 transition-colors cursor-pointer"
                      title="View AI Brain & Training"
                    >
                      <Brain size={10} className="text-cyan-400" />
                      <span>Lv.{aiBrainLevel}</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                  <span className="text-rose-400 font-semibold">Mark:</span>
                  <MarkIcon player="O" symbolSet={symbolSet} size={14} animate={false} />
                  {variant === 'infinity' && (
                    <span className="text-[11px] text-slate-400 font-mono-numbers">
                      ({oMarkCount}/{boardSize})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-mono-numbers text-white">{scoreO}</span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Wins</span>
            </div>
          </div>

          {/* Turn timer progress bar if blitz mode */}
          {isOTurn && maxTurnTime && maxTurnTime > 0 && timeRemaining !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-rose-300 mb-1 font-mono-numbers">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> Turn Clock
                </span>
                <span className={timeRemaining <= 3 ? 'text-rose-400 font-bold animate-pulse' : ''}>
                  {timeRemaining}s
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${timeRemaining <= 3 ? 'bg-rose-500' : 'bg-rose-400'}`}
                  initial={false}
                  animate={{ width: `${(timeRemaining / maxTurnTime) * 100}%` }}
                  transition={{ ease: 'linear', duration: 0.2 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
