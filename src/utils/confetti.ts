/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import confetti from 'canvas-confetti';
import { Player } from '../types/game';

export function fireWinConfetti(winner: Player) {
  const colorsX = ['#06b6d4', '#38bdf8', '#818cf8', '#fbbf24', '#ffffff'];
  const colorsO = ['#f43f5e', '#fb7185', '#f59e0b', '#fde047', '#ffffff'];
  const activeColors = winner === 'X' ? colorsX : colorsO;

  // 1. Initial explosive center blast
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors: activeColors,
    startVelocity: 45,
    scalar: 1.2,
    ticks: 250,
  });

  // 2. Left and right fireworks cannons
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: activeColors,
      startVelocity: 55,
      ticks: 280,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: activeColors,
      startVelocity: 55,
      ticks: 280,
    });
  }, 200);

  // 3. Gold stars shower
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 120,
      origin: { y: 0.4 },
      shapes: ['star', 'circle'],
      colors: ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff'],
      scalar: 1.4,
      ticks: 300,
      gravity: 0.7,
    });
  }, 450);

  // 4. Grand finale side fountains
  setTimeout(() => {
    confetti({
      particleCount: 65,
      angle: 70,
      spread: 60,
      origin: { x: 0.1, y: 0.8 },
      colors: activeColors,
    });
    confetti({
      particleCount: 65,
      angle: 110,
      spread: 60,
      origin: { x: 0.9, y: 0.8 },
      colors: activeColors,
    });
  }, 750);
}

export function fireDrawEffect() {
  // Symmetrical soft floating snowflakes/crystals for stalemate balance
  const drawColors = ['#94a3b8', '#cbd5e1', '#e2e8f0', '#38bdf8', '#fb7185'];

  confetti({
    particleCount: 45,
    spread: 80,
    origin: { y: 0.35 },
    colors: drawColors,
    startVelocity: 25,
    ticks: 350,
    gravity: 0.5,
    scalar: 0.9,
    shapes: ['circle'],
  });

  setTimeout(() => {
    confetti({
      particleCount: 35,
      angle: 270,
      spread: 100,
      origin: { x: 0.5, y: 0.1 },
      colors: drawColors,
      startVelocity: 15,
      ticks: 320,
      gravity: 0.4,
    });
  }, 300);
}
