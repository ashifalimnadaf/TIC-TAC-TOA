/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeConfig, AiSpeed, BoardSize } from '../types/game';
import { aiBrain, AiBrainStats } from '../utils/aiTraining';
import { soundEngine } from '../utils/audio';
import { Brain, Zap, Sparkles, RefreshCw, Trash2, X, CheckCircle2, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface AiBrainModalProps {
  isOpen: boolean;
  theme: ThemeConfig;
  boardSize: BoardSize;
  aiSpeed: AiSpeed;
  onChangeAiSpeed: (speed: AiSpeed) => void;
  onBrainTrained: () => void;
  onClose: () => void;
}

export const AiBrainModal: React.FC<AiBrainModalProps> = ({
  isOpen,
  theme,
  boardSize,
  aiSpeed,
  onChangeAiSpeed,
  onBrainTrained,
  onClose,
}) => {
  const [stats, setStats] = useState<AiBrainStats>(() => aiBrain.getStats());
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [justLeveledUp, setJustLeveledUp] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRunBatchTrain = (iterations: number) => {
    setIsTraining(true);
    soundEngine.playClick();

    setTimeout(() => {
      const updated = aiBrain.runSelfTrainingBatch(iterations, boardSize);
      setStats(updated);
      setIsTraining(false);
      setJustLeveledUp(true);
      soundEngine.playWin();
      onBrainTrained();
      setTimeout(() => setJustLeveledUp(false), 2500);
    }, 180);
  };

  const handleResetBrain = () => {
    soundEngine.playClick();
    const reset = aiBrain.resetMemory();
    setStats(reset);
    onBrainTrained();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-7 border shadow-2xl z-10 ${theme.cardBg} ${theme.cardBorder}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Brain size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Adaptive AI Brain</h2>
              <p className="text-xs text-slate-400">Trained live on your match gameplay & simulations</p>
            </div>
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
          {/* Level Badge Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-800/60 flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Award size={26} />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
                  Intelligence Tier
                </span>
                <h3 className="text-xl font-black text-white font-mono-numbers">
                  Level {stats.trainingLevel}
                </h3>
              </div>
            </div>

            <div className="text-right font-mono-numbers">
              <span className="text-xs text-slate-400 block">Positions Memorized</span>
              <span className="text-sm font-bold text-cyan-300">{stats.experienceCount}</span>
            </div>

            {justLeveledUp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-cyan-500/20 backdrop-blur-xs flex items-center justify-center font-bold text-cyan-200 text-sm gap-2"
              >
                <CheckCircle2 size={18} className="text-cyan-400" />
                <span>Training Batch Complete! Level Up!</span>
              </motion.div>
            )}
          </div>

          {/* Gameplay Learning Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono-numbers text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Games Learned</span>
              <span className="text-lg font-bold text-white mt-1 block">{stats.gamesLearned}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">User Wins Studied</span>
              <span className="text-lg font-bold text-rose-400 mt-1 block">{stats.userWinsStudied}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">AI Wins Honed</span>
              <span className="text-lg font-bold text-cyan-400 mt-1 block">{stats.aiWinsCelebrated}</span>
            </div>
          </div>

          {/* AI Response Speed Setting */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              AI Response Speed
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onChangeAiSpeed('ultra')}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                  aiSpeed === 'ultra'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="block font-bold">⚡ Ultra Fast</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-mono-numbers">~80ms</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeAiSpeed('fast')}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                  aiSpeed === 'fast'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="block font-bold">🚀 Quick</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-mono-numbers">~180ms</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeAiSpeed('normal')}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                  aiSpeed === 'normal'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="block font-bold">⏱️ Natural</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-mono-numbers">~450ms</span>
              </button>
            </div>
          </div>

          {/* Quick-Train Actions */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>Instant Self-Training Simulator</span>
              </span>
              <span className="text-[11px] text-slate-400">Simulates self-play in memory</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isTraining}
                onClick={() => handleRunBatchTrain(50)}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Zap size={14} className="text-amber-400" />
                <span>+50 Self-Play Games</span>
              </button>
              <button
                type="button"
                disabled={isTraining}
                onClick={() => handleRunBatchTrain(150)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${theme.primaryButton}`}
              >
                <RefreshCw size={14} className={isTraining ? 'animate-spin' : ''} />
                <span>+150 Deep Training</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetBrain}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Reset AI Brain</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
