/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, ThemeConfig, SymbolSetId, GameVariant, GameMode } from '../types/game';
import { MarkIcon } from './MarkIcon';
import { Trophy, Scale, RotateCcw, Play, Eye, Flame, Clock, Hash, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VictoryModalProps {
  isOpen: boolean;
  winner: Player | 'draw';
  winnerName: string;
  theme: ThemeConfig;
  symbolSet: SymbolSetId;
  variant: GameVariant;
  gameMode: GameMode;
  totalMoves: number;
  durationSeconds: number;
  seriesScore: { x: number; o: number; draws: number };
  seriesGoal: number;
  streakCount: number;
  onNextRound: () => void;
  onStartReplay: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  winner,
  winnerName,
  theme,
  symbolSet,
  variant,
  gameMode,
  totalMoves,
  durationSeconds,
  seriesScore,
  seriesGoal,
  streakCount,
  onNextRound,
  onStartReplay,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const isWin = winner === 'X' || winner === 'O';
  const isSeriesOver = seriesGoal > 1 && (seriesScore.x >= Math.ceil(seriesGoal / 2) || seriesScore.o >= Math.ceil(seriesGoal / 2));

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-2xl border border-white/20 backdrop-blur-lg text-xs font-semibold cursor-pointer ${
            isWin ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-white'
          }`}
        >
          <Eye size={16} />
          <span>Show Victory Summary</span>
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Scrim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMinimized(true)}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`relative w-full max-w-lg rounded-2xl p-6 sm:p-8 border shadow-2xl z-10 overflow-hidden ${theme.cardBg} ${theme.cardBorder}`}
        >
          {/* Ambient Top Glow */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 blur-3xl opacity-40 pointer-events-none ${
              winner === 'X' ? 'bg-cyan-500' : winner === 'O' ? 'bg-rose-500' : 'bg-amber-400'
            }`}
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Crown / Trophy or Scales Icon */}
            {isWin ? (
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.15, stiffness: 400, damping: 20 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/25 mb-4 flex items-center justify-center"
              >
                <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-amber-400">
                  <Trophy size={40} className="drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.15, stiffness: 400, damping: 20 }}
                className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 p-0.5 shadow-xl mb-4 flex items-center justify-center"
              >
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-slate-300">
                  <Scale size={38} className="drop-shadow-[0_0_8px_rgba(148,163,184,0.4)]" />
                </div>
              </motion.div>
            )}

            {/* Victory / Stalemate Headline */}
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              {isWin ? (
                isSeriesOver ? (
                  `${winnerName} Wins the Series!`
                ) : (
                  `${winnerName} Wins!`
                )
              ) : (
                'Balanced Stalemate'
              )}
            </h2>

            {/* Subtext description */}
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              {isWin ? (
                <span className="flex items-center justify-center gap-1.5 font-medium">
                  Victory claimed with mark
                  <MarkIcon player={winner as Player} symbolSet={symbolSet} size={16} animate={false} />
                  in {totalMoves} moves
                </span>
              ) : (
                'Neither player yielded an inch. Absolute tactical deadlock!'
              )}
            </p>

            {/* Streak banner if on a roll */}
            {isWin && streakCount > 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-full shadow-sm"
              >
                <Flame size={14} className="fill-amber-400" />
                <span>{streakCount}-Game Winning Streak!</span>
              </motion.div>
            )}

            {/* Round Metrics Grid */}
            <div className="w-full grid grid-cols-3 gap-2 mt-6 p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-center font-mono-numbers">
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Hash size={12} /> Moves
                </span>
                <span className="text-base font-bold text-white mt-0.5">{totalMoves}</span>
              </div>
              <div className="flex flex-col items-center border-x border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> Duration
                </span>
                <span className="text-base font-bold text-white mt-0.5">{durationSeconds}s</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-slate-400">Series</span>
                <span className="text-base font-bold text-white mt-0.5">
                  {seriesScore.x} - {seriesScore.o}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-2.5 mt-6">
              <button
                type="button"
                onClick={onNextRound}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isWin
                    ? theme.primaryButton
                    : 'bg-white hover:bg-slate-200 text-slate-950 shadow-md font-semibold'
                }`}
              >
                <RotateCcw size={16} />
                <span>{isSeriesOver ? 'Start New Series' : 'Next Round'}</span>
              </button>

              <button
                type="button"
                onClick={onStartReplay}
                className="py-3 px-4 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-2 border border-slate-700/80 cursor-pointer transition-colors"
              >
                <Play size={15} />
                <span>Replay Moves</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="py-3 px-3 rounded-xl text-sm text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 flex items-center justify-center cursor-pointer transition-colors"
                title="Inspect final board"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
