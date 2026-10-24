/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoardSize, Player, MoveRecord } from '../types/game';
import { checkWinner, isBoardFull } from './ai';

const AI_BRAIN_KEY = 'super_tictactoe_ai_brain_v2';

export interface AiBrainStats {
  experienceCount: number; // total state-action entries in memory
  gamesLearned: number;
  userWinsStudied: number;
  aiWinsCelebrated: number;
  drawsAnalyzed: number;
  trainingLevel: number; // 1 to 50+
  lastTrainedAt?: string;
}

export interface StateActionTable {
  // Hash -> { [moveIndex: number]: score }
  [stateHash: string]: { [moveIndex: number]: number };
}

interface StoredAiMemory {
  qTable: StateActionTable;
  stats: AiBrainStats;
}

const defaultStats: AiBrainStats = {
  experienceCount: 0,
  gamesLearned: 0,
  userWinsStudied: 0,
  aiWinsCelebrated: 0,
  drawsAnalyzed: 0,
  trainingLevel: 1,
};

class AiBrainManager {
  private memory: StoredAiMemory;

  constructor() {
    this.memory = this.loadMemory();
  }

  private loadMemory(): StoredAiMemory {
    try {
      const raw = localStorage.getItem(AI_BRAIN_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          qTable: parsed.qTable || {},
          stats: { ...defaultStats, ...(parsed.stats || {}) },
        };
      }
    } catch {
      // safe fallback
    }
    return {
      qTable: {},
      stats: { ...defaultStats },
    };
  }

  private saveMemory() {
    try {
      localStorage.setItem(AI_BRAIN_KEY, JSON.stringify(this.memory));
    } catch {
      // LocalStorage quota safety
      if (Object.keys(this.memory.qTable).length > 20000) {
        // Prune older lower-weighted entries
        const keys = Object.keys(this.memory.qTable).slice(0, 10000);
        const prunedTable: StateActionTable = {};
        keys.forEach((k) => {
          prunedTable[k] = this.memory.qTable[k];
        });
        this.memory.qTable = prunedTable;
        try {
          localStorage.setItem(AI_BRAIN_KEY, JSON.stringify(this.memory));
        } catch {
          // ignore
        }
      }
    }
  }

  public getStats(): AiBrainStats {
    const tableKeys = Object.keys(this.memory.qTable);
    const count = tableKeys.length;
    const level = Math.min(99, Math.floor(Math.sqrt(this.memory.stats.gamesLearned * 4 + count / 10)) + 1);

    return {
      ...this.memory.stats,
      experienceCount: count,
      trainingLevel: level,
    };
  }

  public resetMemory(): AiBrainStats {
    this.memory = {
      qTable: {},
      stats: { ...defaultStats },
    };
    this.saveMemory();
    return this.getStats();
  }

  /**
   * Produce a compact board state key
   */
  public hashBoard(board: (Player | null)[]): string {
    return board.map((c) => (c === null ? '.' : c)).join('');
  }

  /**
   * Train the AI model from a completed game.
   * Backpropagates reward signals along the moves timeline.
   */
  public learnFromGame(
    history: MoveRecord[],
    winner: Player | 'draw',
    boardSize: BoardSize
  ) {
    if (history.length === 0) return;

    const discountFactor = 0.88; // Gamma
    const learningRate = 0.35; // Alpha

    // Determine final game reward for AI (Player 'O')
    let baseReward = 0;
    if (winner === 'O') {
      baseReward = 1.0;
      this.memory.stats.aiWinsCelebrated += 1;
    } else if (winner === 'X') {
      baseReward = -1.0;
      this.memory.stats.userWinsStudied += 1;
    } else {
      baseReward = 0.2; // Slight reward for forcing a draw
      this.memory.stats.drawsAnalyzed += 1;
    }

    this.memory.stats.gamesLearned += 1;
    this.memory.stats.lastTrainedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Step through the moves and reconstruct state
    const reconstructedBoard: (Player | null)[] = Array(boardSize * boardSize).fill(null);

    // If user won (X won), also perform Imitation Learning:
    // AI learns that user's moves were successful and should be mirrored!
    history.forEach((record, stepIdx) => {
      const stateHash = this.hashBoard(reconstructedBoard);
      const moveIdx = record.index;

      if (!this.memory.qTable[stateHash]) {
        this.memory.qTable[stateHash] = {};
      }

      const currentScore = this.memory.qTable[stateHash][moveIdx] || 0;
      const stepsFromEnd = history.length - 1 - stepIdx;
      const decayedReward = baseReward * Math.pow(discountFactor, stepsFromEnd);

      if (record.player === 'O') {
        // AI's move: directly update with reinforcement signal
        this.memory.qTable[stateHash][moveIdx] = currentScore + learningRate * (decayedReward - currentScore);
      } else if (record.player === 'X' && winner === 'X') {
        // User's move that crushed the AI: mark this state-move as high value for defense!
        const userReward = 0.75 * Math.pow(discountFactor, stepsFromEnd);
        this.memory.qTable[stateHash][moveIdx] = currentScore + learningRate * (userReward - currentScore);
      }

      // Apply move for next step
      reconstructedBoard[record.index] = record.player;
    });

    this.saveMemory();
  }

  /**
   * Fast Self-Training Batch:
   * Simulates N self-play games in pure memory to accelerate AI intelligence in milliseconds!
   */
  public runSelfTrainingBatch(iterations: number = 50, boardSize: BoardSize = 3): AiBrainStats {
    for (let g = 0; g < iterations; g++) {
      const simBoard: (Player | null)[] = Array(boardSize * boardSize).fill(null);
      let turn: Player = 'X';
      const simHistory: MoveRecord[] = [];
      let roundWinner: Player | 'draw' | null = null;

      for (let moveCount = 0; moveCount < boardSize * boardSize; moveCount++) {
        // Find available moves
        const available: number[] = [];
        simBoard.forEach((v, i) => {
          if (v === null) available.push(i);
        });

        if (available.length === 0) {
          roundWinner = 'draw';
          break;
        }

        // Pick move using epsilon-greedy on current Q-table
        const stateHash = this.hashBoard(simBoard);
        const qScores = this.memory.qTable[stateHash] || {};

        let chosenMove: number;
        if (Math.random() < 0.25) {
          // Explore
          chosenMove = available[Math.floor(Math.random() * available.length)];
        } else {
          // Exploit highest Q-score or immediate win
          let bestVal = -Infinity;
          let bestIdx = available[0];
          for (const m of available) {
            // Check immediate win
            simBoard[m] = turn;
            const { winner: winCheck } = checkWinner(simBoard, boardSize);
            simBoard[m] = null;
            if (winCheck === turn) {
              bestIdx = m;
              break;
            }

            const score = qScores[m] !== undefined ? qScores[m] : 0;
            if (score > bestVal) {
              bestVal = score;
              bestIdx = m;
            }
          }
          chosenMove = bestIdx;
        }

        simBoard[chosenMove] = turn;
        simHistory.push({
          index: chosenMove,
          player: turn,
          moveNumber: moveCount + 1,
        });

        const { winner } = checkWinner(simBoard, boardSize);
        if (winner) {
          roundWinner = winner;
          break;
        }

        if (isBoardFull(simBoard)) {
          roundWinner = 'draw';
          break;
        }

        turn = turn === 'X' ? 'O' : 'X';
      }

      if (roundWinner) {
        this.learnFromGame(simHistory, roundWinner, boardSize);
      }
    }

    return this.getStats();
  }

  /**
   * Query the trained experience table for the best move in the current board state
   */
  public queryBestTrainedMove(
    board: (Player | null)[],
    availableMoves: number[]
  ): { move: number; confidence: number } | null {
    const stateHash = this.hashBoard(board);
    const qScores = this.memory.qTable[stateHash];

    if (!qScores) return null;

    let bestScore = -Infinity;
    let bestMove: number | null = null;

    for (const m of availableMoves) {
      if (qScores[m] !== undefined && qScores[m] > bestScore) {
        bestScore = qScores[m];
        bestMove = m;
      }
    }

    if (bestMove !== null && bestScore > 0.05) {
      return { move: bestMove, confidence: Math.min(100, Math.round(bestScore * 100)) };
    }

    return null;
  }
}

export const aiBrain = new AiBrainManager();
