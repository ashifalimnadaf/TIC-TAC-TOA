/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MatchStats, ThemeConfig } from '../types/game';
import { X, BarChart3, Trophy, Flame, Zap, Trash2, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsDrawerProps {
  isOpen: boolean;
  theme: ThemeConfig;
  stats: MatchStats;
  onClearStats: () => void;
  onClose: () => void;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({
  isOpen,
  theme,
  stats,
  onClearStats,
  onClose,
}) => {
  if (!isOpen) return null;

  const total = stats.gamesPlayed;
  const xPercent = total > 0 ? Math.round((stats.xWins / total) * 100) : 0;
  const oPercent = total > 0 ? Math.round((stats.oWins / total) * 100) : 0;
  const drawPercent = total > 0 ? Math.round((stats.draws / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 border shadow-2xl z-10 ${theme.cardBg} ${theme.cardBorder}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BarChart3 size={20} className="text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-display">Performance Statistics</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 pt-5">
          {/* Top KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-numbers">
            <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="block text-[11px] text-slate-400 uppercase tracking-wider">Games</span>
              <span className="text-2xl font-extrabold text-white mt-1">{stats.gamesPlayed}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="block text-[11px] text-slate-400 uppercase tracking-wider">X Wins</span>
              <span className="text-2xl font-extrabold text-cyan-400 mt-1">{stats.xWins}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="block text-[11px] text-slate-400 uppercase tracking-wider">O Wins</span>
              <span className="text-2xl font-extrabold text-rose-400 mt-1">{stats.oWins}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="block text-[11px] text-slate-400 uppercase tracking-wider">Draws</span>
              <span className="text-2xl font-extrabold text-slate-300 mt-1">{stats.draws}</span>
            </div>
          </div>

          {/* Win Distribution Bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>Win Rate Ratio</span>
              <span className="font-mono-numbers text-slate-400">
                X: {xPercent}% · O: {oPercent}% · Draws: {drawPercent}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
              <div style={{ width: `${xPercent}%` }} className="h-full bg-cyan-400 transition-all duration-500" title={`X: ${xPercent}%`} />
              <div style={{ width: `${oPercent}%` }} className="h-full bg-rose-400 transition-all duration-500" title={`O: ${oPercent}%`} />
              <div style={{ width: `${drawPercent}%` }} className="h-full bg-slate-600 transition-all duration-500" title={`Draws: ${drawPercent}%`} />
            </div>
          </div>

          {/* Records & Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-numbers">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Flame size={18} />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 uppercase tracking-wider">Best Win Streak</span>
                <span className="text-base font-bold text-white">
                  {stats.bestStreakCount > 0 ? `${stats.bestStreakCount} Games (${stats.bestStreakPlayer})` : 'None yet'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Zap size={18} />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 uppercase tracking-wider">Fastest Victory</span>
                <span className="text-base font-bold text-white">
                  {stats.fastestWinSeconds ? `${stats.fastestWinSeconds} Seconds` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Match History */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Recent Matches
            </h3>
            {stats.history.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/30 rounded-xl border border-dashed border-slate-800">
                No match history recorded yet. Play a game to record stats!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {stats.history.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs font-mono-numbers"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                          m.winner === 'X'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : m.winner === 'O'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-slate-700/40 text-slate-300'
                        }`}
                      >
                        {m.winner === 'draw' ? '=' : m.winner}
                      </span>
                      <span className="text-white font-medium">{m.winnerName}</span>
                      <span className="text-slate-500 text-[11px]">
                        ({m.boardSize}×{m.boardSize} {m.variant})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span>{m.totalMoves} moves</span>
                      <span>{m.durationSeconds}s</span>
                      <span className="text-slate-500">{m.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClearStats}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Clear Statistics</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
