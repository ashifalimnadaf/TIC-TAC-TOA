/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeConfig } from '../types/game';
import { X, BookOpen, Infinity, Swords, Clock, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

interface GameRulesModalProps {
  isOpen: boolean;
  theme: ThemeConfig;
  onClose: () => void;
}

export const GameRulesModal: React.FC<GameRulesModalProps> = ({
  isOpen,
  theme,
  onClose,
}) => {
  if (!isOpen) return null;

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
            <BookOpen size={20} className="text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-display">Game Rules & Tactical Guide</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 pt-5 text-sm text-slate-300">
          {/* Classic */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <Swords size={16} className="text-cyan-400" />
              <span>Classic Tic-Tac-Toe</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Players alternate placing their mark in an empty cell. The first player to align 3 consecutive marks (or 4 on 4×4 and 5×5 grids) horizontally, vertically, or diagonally wins immediately. If the entire grid fills with no aligned marks, the game ends in a draw (Stalemate / Cat’s Game).
            </p>
          </div>

          {/* Infinity Mode */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <Infinity size={16} className="text-amber-400" />
              <span>Infinity Mode (Dynamic Piece Limit)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A thrilling dynamic rule where each player can only keep a maximum of <strong>3 marks</strong> on the board at any time. When you make your 4th move, your oldest mark disappears from the board! This guarantees matches never stall into boring draws and demands proactive foresight.
            </p>
          </div>

          {/* Blitz Mode */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <Clock size={16} className="text-rose-400" />
              <span>Blitz Turn Clock</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enable 5s, 10s, or 15s speed clocks per move. If your clock reaches zero before placing a mark, your turn is forfeited or an automatic random move is placed! Listen for the warning ticks when under 3 seconds.
            </p>
          </div>

          {/* Pro Strategy Tips */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <Lightbulb size={16} className="text-yellow-400" />
              <span>Grandmaster AI Tips</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Grandmaster AI uses an exhaustive Minimax search algorithm with alpha-beta pruning. In 3×3 classic, optimal play from both sides will always yield a draw. To test your skill, try playing second (as O) or switch to 4×4 and 5×5 boards where human intuition can challenge the machine!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${theme.primaryButton}`}
          >
            Got It!
          </button>
        </div>
      </motion.div>
    </div>
  );
};
