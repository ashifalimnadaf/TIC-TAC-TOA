/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, RotateCcw, Brain } from 'lucide-react';
import { ThemeConfig } from '../types/game';

interface NavbarProps {
  theme: ThemeConfig;
  soundMuted: boolean;
  aiLevel?: number;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onOpenBrain: () => void;
  onNewGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  soundMuted,
  aiLevel,
  onToggleSound,
  onOpenSettings,
  onOpenRules,
  onOpenStats,
  onOpenBrain,
  onNewGame,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap font-display">
            Super Tic-Tac-Toe Arena
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={onOpenSettings}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Game Setup
          </button>
          <button
            onClick={onOpenRules}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Rules & Modes
          </button>
          <button
            onClick={onOpenStats}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Statistics
          </button>
          <button
            onClick={onOpenBrain}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 text-cyan-300 font-medium"
            title="Open AI Adaptive Brain"
          >
            <Brain size={16} className="text-cyan-400" />
            <span>AI Brain {aiLevel ? `(Lv.${aiLevel})` : ''}</span>
          </button>
          <button
            onClick={onToggleSound}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {soundMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-cyan-400" />}
            <span>{soundMuted ? 'Muted' : 'Sound On'}</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewGame}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${theme.primaryButton}`}
          >
            <RotateCcw size={14} />
            <span>Reset Board</span>
          </button>
        </div>
      </div>
    </header>
  );
};
