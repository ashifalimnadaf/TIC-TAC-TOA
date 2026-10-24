/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BoardSize,
  GameMode,
  AiDifficulty,
  GameVariant,
  SeriesLength,
  ThemeId,
  SymbolSetId,
  ThemeConfig,
} from '../types/game';
import { THEMES, SYMBOL_PACKS } from '../utils/theme';
import { X, Sliders, Palette, Zap, Sparkles, User, Bot } from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  theme: ThemeConfig;
  gameMode: GameMode;
  aiDifficulty: AiDifficulty;
  boardSize: BoardSize;
  variant: GameVariant;
  seriesGoal: SeriesLength;
  timerSeconds: number;
  currentThemeId: ThemeId;
  currentSymbolSetId: SymbolSetId;
  playerXName: string;
  playerOName: string;
  onUpdateSettings: (settings: {
    gameMode?: GameMode;
    aiDifficulty?: AiDifficulty;
    boardSize?: BoardSize;
    variant?: GameVariant;
    seriesGoal?: SeriesLength;
    timerSeconds?: number;
    themeId?: ThemeId;
    symbolSetId?: SymbolSetId;
    playerXName?: string;
    playerOName?: string;
  }) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  theme,
  gameMode,
  aiDifficulty,
  boardSize,
  variant,
  seriesGoal,
  timerSeconds,
  currentThemeId,
  currentSymbolSetId,
  playerXName,
  playerOName,
  onUpdateSettings,
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
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 border shadow-2xl z-10 ${theme.cardBg} ${theme.cardBorder}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sliders size={20} className="text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-display">Match Setup & Preferences</h2>
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
          {/* 1. Game Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ gameMode: 'pve', playerOName: 'Nexus AI' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  gameMode === 'pve'
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Bot size={15} />
                <span>Player vs AI Bot</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ gameMode: 'pvp', playerOName: 'Player 2' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  gameMode === 'pvp'
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <User size={15} />
                <span>Pass & Play (2-Player)</span>
              </button>
            </div>
          </div>

          {/* AI Difficulty (If PvE) */}
          {gameMode === 'pve' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                AI Difficulty Engine
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'unbeatable'] as AiDifficulty[]).map((level) => {
                  const labels = {
                    easy: 'Novice (Casual)',
                    medium: 'Tactician (Balanced)',
                    unbeatable: 'Grandmaster (Minimax)',
                  };
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => onUpdateSettings({ aiDifficulty: level })}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                        aiDifficulty === level
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      {labels[level]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Board Size & Variant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Board Grid Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([3, 4, 5] as BoardSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onUpdateSettings({ boardSize: size })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center font-mono-numbers ${
                      boardSize === size
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Rule Variant
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ variant: 'classic' })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                    variant === 'classic'
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Classic Rules
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ variant: 'infinity' })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                    variant === 'infinity'
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Infinity (3 Marks)
                </button>
              </div>
            </div>
          </div>

          {/* 3. Series Length & Turn Timer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Match Series Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([1, 3, 5] as SeriesLength[]).map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => onUpdateSettings({ seriesGoal: len })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                      seriesGoal === len
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {len === 1 ? 'Single' : `Best of ${len}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Turn Clock (Blitz)
              </label>
              <div className="grid grid-cols-4 gap-1.5 font-mono-numbers">
                {[0, 5, 10, 15].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => onUpdateSettings({ timerSeconds: sec })}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                      timerSeconds === sec
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {sec === 0 ? 'Off' : `${sec}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Symbol Set Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Mark Icon Pack
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(SYMBOL_PACKS).map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => onUpdateSettings({ symbolSetId: pack.id })}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    currentSymbolSetId === pack.id
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{pack.name}</span>
                  <span className="font-bold text-cyan-300 font-mono">
                    {pack.xLabel} / {pack.oLabel}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Theme Palette Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Visual Arena Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(THEMES).map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onUpdateSettings({ themeId: th.id })}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                    currentThemeId === th.id
                      ? 'border-cyan-400 ring-1 ring-cyan-400/50 bg-slate-900 shadow-md'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <span className="block font-semibold text-white">{th.name}</span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400" />
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Custom Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Player 1 Name (X)
              </label>
              <input
                type="text"
                value={playerXName}
                maxLength={18}
                onChange={(e) => onUpdateSettings({ playerXName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Player 2 Name (O)
              </label>
              <input
                type="text"
                value={playerOName}
                maxLength={18}
                onChange={(e) => onUpdateSettings({ playerOName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${theme.primaryButton}`}
          >
            Apply & Play
          </button>
        </div>
      </motion.div>
    </div>
  );
};
