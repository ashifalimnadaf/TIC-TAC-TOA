/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BoardSize, MoveRecord, Player, ThemeConfig, SymbolSetId } from '../types/game';
import { MarkIcon } from './MarkIcon';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion } from 'motion/react';

interface ReplayViewerProps {
  isOpen: boolean;
  boardSize: BoardSize;
  moveHistory: MoveRecord[];
  theme: ThemeConfig;
  symbolSet: SymbolSetId;
  playerXName: string;
  playerOName: string;
  winner: Player | 'draw';
  onClose: () => void;
}

export const ReplayViewer: React.FC<ReplayViewerProps> = ({
  isOpen,
  boardSize,
  moveHistory,
  theme,
  symbolSet,
  playerXName,
  playerOName,
  winner,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(moveHistory.length);
      setIsPlaying(false);
    }
  }, [isOpen, moveHistory.length]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (currentStep < moveHistory.length) {
        timer = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 700);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, moveHistory.length]);

  if (!isOpen) return null;

  // Reconstruct board at current step
  const reconstructedBoard: (Player | null)[] = Array(boardSize * boardSize).fill(null);
  for (let i = 0; i < currentStep; i++) {
    const move = moveHistory[i];
    if (move) {
      reconstructedBoard[move.index] = move.player;
    }
  }

  const latestMove = currentStep > 0 ? moveHistory[currentStep - 1] : null;

  const getGridColsClass = () => {
    if (boardSize === 3) return 'grid-cols-3';
    if (boardSize === 4) return 'grid-cols-4';
    return 'grid-cols-5';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`relative w-full max-w-xl rounded-2xl p-6 sm:p-7 border shadow-2xl z-10 ${theme.cardBg} ${theme.cardBorder}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white font-display">Match Replay</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{playerXName} (X)</span>
              <span aria-hidden="true">vs</span>
              <span>{playerOName} (O)</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-amber-400">
                {winner === 'draw' ? 'Draw' : `${winner} Won`}
              </span>
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

        {/* Board Display */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div
            className={`grid ${getGridColsClass()} gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 shadow-inner`}
          >
            {reconstructedBoard.map((cell, idx) => {
              const isJustPlaced = latestMove?.index === idx;
              return (
                <div
                  key={idx}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center border font-display transition-all ${
                    theme.cellBg
                  } ${
                    isJustPlaced
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 z-10 bg-amber-500/10'
                      : 'border-white/5'
                  }`}
                >
                  {cell && (
                    <div className={cell === 'X' ? theme.accentX : theme.accentO}>
                      <MarkIcon player={cell} symbolSet={symbolSet} size={32} animate={isJustPlaced} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Step Status */}
          <div className="mt-4 text-xs font-mono-numbers text-slate-300 flex items-center gap-2">
            <span>
              Move <strong className="text-white">{currentStep}</strong> of{' '}
              <strong className="text-white">{moveHistory.length}</strong>
            </span>
            {latestMove && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">
                  {latestMove.player === 'X' ? playerXName : playerOName} played cell {latestMove.index + 1}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="pt-2 border-t border-slate-800/80 space-y-4">
          {/* Progress Scrub Slider */}
          <div className="px-2">
            <input
              type="range"
              min={0}
              max={moveHistory.length}
              value={currentStep}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentStep(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Buttons Strip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(0);
                }}
                disabled={currentStep === 0}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Start"
              >
                <SkipBack size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentStep === 0}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Previous Move"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (currentStep >= moveHistory.length) {
                  setCurrentStep(0);
                }
                setIsPlaying(!isPlaying);
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause' : currentStep >= moveHistory.length ? 'Restart' : 'Play'}</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep((prev) => Math.min(moveHistory.length, prev + 1));
                }}
                disabled={currentStep >= moveHistory.length}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Next Move"
              >
                <ChevronRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(moveHistory.length);
                }}
                disabled={currentStep >= moveHistory.length}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Jump to End"
              >
                <SkipForward size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
