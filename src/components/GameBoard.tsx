/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BoardSize, Player, ThemeConfig, WinLine, SymbolSetId } from '../types/game';
import { MarkIcon } from './MarkIcon';
import { motion } from 'motion/react';

interface GameBoardProps {
  board: (Player | null)[];
  boardSize: BoardSize;
  winLine: WinLine | null;
  isDraw: boolean;
  currentPlayer: Player;
  isGameOver: boolean;
  isAiThinking: boolean;
  theme: ThemeConfig;
  symbolSet: SymbolSetId;
  oldestMarkIndex?: number | null; // For infinity mode warning
  onCellClick: (index: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  boardSize,
  winLine,
  isDraw,
  currentPlayer,
  isGameOver,
  isAiThinking,
  theme,
  symbolSet,
  oldestMarkIndex = null,
  onCellClick,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getGridColsClass = () => {
    if (boardSize === 3) return 'grid-cols-3';
    if (boardSize === 4) return 'grid-cols-4';
    return 'grid-cols-5';
  };

  const getCellSizeClass = () => {
    if (boardSize === 3) return 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-4xl sm:text-5xl';
    if (boardSize === 4) return 'w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 text-3xl sm:text-4xl';
    return 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-2xl sm:text-3xl';
  };

  const isWinningCell = (idx: number) => {
    return winLine?.indices.includes(idx) ?? false;
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Board Outer Container */}
      <div
        className={`relative p-3.5 sm:p-5 rounded-2xl transition-all duration-500 shadow-2xl backdrop-blur-xl ${
          theme.gridBg
        } ${isDraw ? 'animate-board-quake animate-draw-frost' : ''}`}
      >
        {/* Subtle radial glow underlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* The Interactive Grid */}
        <div
          className={`grid ${getGridColsClass()} gap-2.5 sm:gap-3 relative z-10`}
          role="grid"
          aria-label="Tic-Tac-Toe Game Grid"
        >
          {board.map((cell, index) => {
            const isWinner = isWinningCell(index);
            const isOldest = oldestMarkIndex === index;
            const canClick = cell === null && !isGameOver && !isAiThinking;

            return (
              <motion.button
                key={index}
                type="button"
                role="gridcell"
                tabIndex={canClick ? 0 : -1}
                aria-label={`Cell ${index + 1}, ${cell ? `filled by ${cell}` : 'empty'}`}
                disabled={!canClick}
                onClick={() => onCellClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={canClick ? { scale: 1.025, y: -2 } : {}}
                whileTap={canClick ? { scale: 0.96 } : {}}
                className={`
                  ${getCellSizeClass()}
                  rounded-xl flex items-center justify-center relative font-display font-black
                  transition-colors duration-150 cursor-pointer select-none border border-white/5
                  ${theme.cellBg}
                  ${canClick ? theme.cellHover : ''}
                  ${
                    isWinner
                      ? 'z-20 scale-105 shadow-2xl ring-2 ring-amber-400 bg-amber-500/20 animate-win-halo'
                      : ''
                  }
                  ${
                    isOldest && !isGameOver
                      ? 'ring-2 ring-rose-500/70 border-dashed animate-pulse'
                      : ''
                  }
                `}
              >
                {/* Placed Mark */}
                {cell && (
                  <div
                    className={`flex items-center justify-center ${
                      cell === 'X' ? theme.accentX : theme.accentO
                    } ${isWinner ? 'text-amber-300 drop-shadow-[0_0_16px_rgba(251,191,36,0.8)]' : ''}`}
                  >
                    <MarkIcon
                      player={cell}
                      symbolSet={symbolSet}
                      size={boardSize === 3 ? 56 : boardSize === 4 ? 42 : 32}
                    />
                  </div>
                )}

                {/* Oldest Mark Warning Ribbon (Infinity Mode) */}
                {isOldest && cell && !isGameOver && (
                  <span className="absolute bottom-1 text-[9px] uppercase font-bold tracking-widest text-rose-400 bg-rose-950/80 px-1 rounded border border-rose-800">
                    Oldest
                  </span>
                )}

                {/* Ghost Hover Preview */}
                {!cell && hoveredIndex === index && canClick && (
                  <div
                    className={`opacity-35 pointer-events-none transition-opacity duration-150 ${
                      currentPlayer === 'X' ? theme.accentX : theme.accentO
                    }`}
                  >
                    <MarkIcon
                      player={currentPlayer}
                      symbolSet={symbolSet}
                      size={boardSize === 3 ? 48 : boardSize === 4 ? 36 : 28}
                      animate={false}
                    />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
