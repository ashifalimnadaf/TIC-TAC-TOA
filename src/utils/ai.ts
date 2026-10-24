/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoardSize, Player, WinLine, GameVariant } from '../types/game';
import { aiBrain } from './aiTraining';

export interface WinCheckResult {
  winner: Player | null;
  winLine: WinLine | null;
}

export function getTargetConsecutive(boardSize: BoardSize): number {
  if (boardSize === 3) return 3;
  if (boardSize === 4) return 4;
  return 4; // 4 in a row for 5x5 provides the most exciting balance
}

/**
 * Check if the board has a winner and return the line indices and direction
 */
export function checkWinner(
  board: (Player | null)[],
  boardSize: BoardSize
): WinCheckResult {
  const target = getTargetConsecutive(boardSize);
  const size = boardSize;

  // Check horizontal rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - target; c++) {
      const first = board[r * size + c];
      if (!first) continue;
      let match = true;
      const indices = [r * size + c];
      for (let k = 1; k < target; k++) {
        const next = board[r * size + c + k];
        if (next !== first) {
          match = false;
          break;
        }
        indices.push(r * size + c + k);
      }
      if (match) {
        return {
          winner: first,
          winLine: { indices, direction: 'horizontal' },
        };
      }
    }
  }

  // Check vertical columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - target; r++) {
      const first = board[r * size + c];
      if (!first) continue;
      let match = true;
      const indices = [r * size + c];
      for (let k = 1; k < target; k++) {
        const next = board[(r + k) * size + c];
        if (next !== first) {
          match = false;
          break;
        }
        indices.push((r + k) * size + c);
      }
      if (match) {
        return {
          winner: first,
          winLine: { indices, direction: 'vertical' },
        };
      }
    }
  }

  // Check diagonal main (\)
  for (let r = 0; r <= size - target; r++) {
    for (let c = 0; c <= size - target; c++) {
      const first = board[r * size + c];
      if (!first) continue;
      let match = true;
      const indices = [r * size + c];
      for (let k = 1; k < target; k++) {
        const next = board[(r + k) * size + (c + k)];
        if (next !== first) {
          match = false;
          break;
        }
        indices.push((r + k) * size + (c + k));
      }
      if (match) {
        return {
          winner: first,
          winLine: { indices, direction: 'diagonal-main' },
        };
      }
    }
  }

  // Check diagonal anti (/)
  for (let r = 0; r <= size - target; r++) {
    for (let c = target - 1; c < size; c++) {
      const first = board[r * size + c];
      if (!first) continue;
      let match = true;
      const indices = [r * size + c];
      for (let k = 1; k < target; k++) {
        const next = board[(r + k) * size + (c - k)];
        if (next !== first) {
          match = false;
          break;
        }
        indices.push((r + k) * size + (c - k));
      }
      if (match) {
        return {
          winner: first,
          winLine: { indices, direction: 'diagonal-anti' },
        };
      }
    }
  }

  return { winner: null, winLine: null };
}

export function isBoardFull(board: (Player | null)[]): boolean {
  return board.every((cell) => cell !== null);
}

// ----------------------------------------------------
// AI LOGIC (Trained Brain + Unbeatable Minimax)
// ----------------------------------------------------

export function getAiMove(
  board: (Player | null)[],
  boardSize: BoardSize,
  aiPlayer: Player,
  difficulty: 'easy' | 'medium' | 'unbeatable',
  variant: GameVariant = 'classic'
): number {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const availableMoves: number[] = [];
  board.forEach((val, idx) => {
    if (val === null) availableMoves.push(idx);
  });

  if (availableMoves.length === 0) return -1;

  // Easy: Mostly random (80% random, 20% smart)
  if (difficulty === 'easy') {
    if (Math.random() < 0.8) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // Step 1: Check immediate win for AI (Always take immediate victory!)
  for (const move of availableMoves) {
    board[move] = aiPlayer;
    const { winner } = checkWinner(board, boardSize);
    board[move] = null;
    if (winner === aiPlayer) return move;
  }

  // Step 2: Check immediate block for Human (Always shut down opponent wins)
  for (const move of availableMoves) {
    board[move] = humanPlayer;
    const { winner } = checkWinner(board, boardSize);
    board[move] = null;
    if (winner === humanPlayer) return move;
  }

  // Step 3: Check Gameplay-Trained Brain Memory!
  // If the AI has learned winning patterns or human traps from past gameplay, use them!
  if (difficulty !== 'easy') {
    const trainedResponse = aiBrain.queryBestTrainedMove(board, availableMoves);
    if (trainedResponse && trainedResponse.confidence >= 35) {
      return trainedResponse.move;
    }
  }

  // Medium difficulty: simple strategic weighting (center, corners)
  if (difficulty === 'medium') {
    const center = Math.floor((boardSize * boardSize) / 2);
    if (availableMoves.includes(center)) return center;

    const corners = [
      0,
      boardSize - 1,
      boardSize * (boardSize - 1),
      boardSize * boardSize - 1,
    ].filter((c) => availableMoves.includes(c));

    if (corners.length > 0 && Math.random() < 0.75) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // UNBEATABLE (Grandmaster)
  if (boardSize === 3) {
    return getMinimaxBestMove3x3(board, aiPlayer, humanPlayer);
  }

  // 4x4 and 5x5: Depth-limited Alpha-Beta heuristic search
  return getAlphaBetaMove(board, boardSize, aiPlayer, humanPlayer);
}

function getMinimaxBestMove3x3(
  board: (Player | null)[],
  aiPlayer: Player,
  humanPlayer: Player
): number {
  // If first move of the game, take center or a corner for speed
  const emptyCount = board.filter((c) => c === null).length;
  if (emptyCount === 9) {
    const openers = [0, 2, 4, 6, 8];
    return openers[Math.floor(Math.random() * openers.length)];
  }
  if (emptyCount === 8 && board[4] === null) {
    return 4; // take center if available
  }

  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = aiPlayer;
      const score = minimax(board, 0, false, aiPlayer, humanPlayer, -Infinity, Infinity);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function minimax(
  board: (Player | null)[],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha: number,
  beta: number
): number {
  const { winner } = checkWinner(board, 3);
  if (winner === aiPlayer) return 10 - depth;
  if (winner === humanPlayer) return depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = aiPlayer;
        const evaluation = minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
        board[i] = null;
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = humanPlayer;
        const evaluation = minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
        board[i] = null;
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}

// Alpha-Beta heuristic evaluator for larger boards (4x4, 5x5)
function getAlphaBetaMove(
  board: (Player | null)[],
  boardSize: BoardSize,
  aiPlayer: Player,
  humanPlayer: Player
): number {
  const availableMoves: number[] = [];
  board.forEach((val, idx) => {
    if (val === null) availableMoves.push(idx);
  });

  // Sort available moves by distance to center to prioritize potent moves
  const center = (boardSize - 1) / 2;
  availableMoves.sort((a, b) => {
    const rA = Math.floor(a / boardSize);
    const cA = a % boardSize;
    const rB = Math.floor(b / boardSize);
    const cB = b % boardSize;
    const distA = Math.hypot(rA - center, cA - center);
    const distB = Math.hypot(rB - center, cB - center);
    return distA - distB;
  });

  const maxDepth = boardSize === 4 ? 3 : 2;
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    board[move] = aiPlayer;
    const score = evaluateBoard(board, boardSize, aiPlayer, humanPlayer, 0, maxDepth, false, -Infinity, Infinity);
    board[move] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function evaluateBoard(
  board: (Player | null)[],
  boardSize: BoardSize,
  aiPlayer: Player,
  humanPlayer: Player,
  depth: number,
  maxDepth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number {
  const { winner } = checkWinner(board, boardSize);
  if (winner === aiPlayer) return 1000 - depth * 10;
  if (winner === humanPlayer) return depth * 10 - 1000;
  if (isBoardFull(board) || depth >= maxDepth) {
    return scoreStaticState(board, boardSize, aiPlayer, humanPlayer);
  }

  const emptyIndices: number[] = [];
  board.forEach((v, i) => {
    if (v === null) emptyIndices.push(i);
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const idx of emptyIndices) {
      board[idx] = aiPlayer;
      const evaluation = evaluateBoard(board, boardSize, aiPlayer, humanPlayer, depth + 1, maxDepth, false, alpha, beta);
      board[idx] = null;
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const idx of emptyIndices) {
      board[idx] = humanPlayer;
      const evaluation = evaluateBoard(board, boardSize, aiPlayer, humanPlayer, depth + 1, maxDepth, true, alpha, beta);
      board[idx] = null;
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function scoreStaticState(
  board: (Player | null)[],
  boardSize: BoardSize,
  aiPlayer: Player,
  humanPlayer: Player
): number {
  let score = 0;
  const target = getTargetConsecutive(boardSize);
  const size = boardSize;

  const countWindow = (window: (Player | null)[]) => {
    let aiCount = 0;
    let humanCount = 0;
    for (const p of window) {
      if (p === aiPlayer) aiCount++;
      if (p === humanPlayer) humanCount++;
    }
    if (aiCount > 0 && humanCount > 0) return 0;
    if (aiCount === target - 1) return 80;
    if (aiCount === target - 2) return 15;
    if (humanCount === target - 1) return -90;
    if (humanCount === target - 2) return -20;
    return 0;
  };

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - target; c++) {
      const window: (Player | null)[] = [];
      for (let k = 0; k < target; k++) {
        window.push(board[r * size + c + k]);
      }
      score += countWindow(window);
    }
  }

  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - target; r++) {
      const window: (Player | null)[] = [];
      for (let k = 0; k < target; k++) {
        window.push(board[(r + k) * size + c]);
      }
      score += countWindow(window);
    }
  }

  return score;
}
