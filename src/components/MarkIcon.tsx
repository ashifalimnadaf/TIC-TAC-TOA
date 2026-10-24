/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Player, SymbolSetId } from '../types/game';
import { X, Circle, Triangle, Hexagon, Flame, Snowflake, Sun, Moon, Swords, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface MarkIconProps {
  player: Player;
  symbolSet?: SymbolSetId;
  className?: string;
  size?: number;
  animate?: boolean;
}

export const MarkIcon: React.FC<MarkIconProps> = ({
  player,
  symbolSet = 'classic',
  className = '',
  size = 48,
  animate = true,
}) => {
  const iconProps = {
    size,
    strokeWidth: 2.75,
    className: 'drop-shadow-sm',
  };

  const renderIcon = () => {
    if (symbolSet === 'cyber') {
      return player === 'X' ? <Triangle {...iconProps} /> : <Hexagon {...iconProps} />;
    }
    if (symbolSet === 'elements') {
      return player === 'X' ? <Flame {...iconProps} /> : <Snowflake {...iconProps} />;
    }
    if (symbolSet === 'celestial') {
      return player === 'X' ? <Sun {...iconProps} /> : <Moon {...iconProps} />;
    }
    if (symbolSet === 'weapons') {
      return player === 'X' ? <Swords {...iconProps} /> : <Shield {...iconProps} />;
    }
    // classic
    return player === 'X' ? <X {...iconProps} /> : <Circle {...iconProps} />;
  };

  if (!animate) {
    return <span className={`inline-flex items-center justify-center ${className}`}>{renderIcon()}</span>;
  }

  return (
    <motion.div
      initial={{ scale: 0.1, rotate: player === 'X' ? -25 : 25, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 24,
      }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {renderIcon()}
    </motion.div>
  );
};
