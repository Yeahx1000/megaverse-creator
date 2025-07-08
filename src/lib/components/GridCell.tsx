import React from 'react';
import { AstralObject, MegaverseObject } from '../types';

interface GridCellProps {
  row: number;
  col: number;
  currentValue: AstralObject;
  goalObject: MegaverseObject | null;
  isGoal: boolean;
  onClick?: () => void;
  className?: string;
}

const GridCell: React.FC<GridCellProps> = ({ 
  row, 
  col, 
  currentValue, 
  goalObject, 
  isGoal, 
  onClick, 
  className 
}) => {
  const getCellContent = () => {
    if (isGoal) {
      if (!goalObject) return '🌌';
      
      switch (goalObject.type) {
        case 'POLYANET':
          return '⭐';
        case 'SOLOON':
          return goalObject.color === 'white' ? '⚪' :
                 goalObject.color === 'blue' ? '🔵' :
                 goalObject.color === 'purple' ? '🟣' : '🔴';
        case 'COMETH':
          return '☄️';
        default:
          return '🌌';
      }
    } else {
      switch (currentValue) {
        case 'POLYANET':
          return '🪐';
        case 'SOLOON':
          if (goalObject?.type === 'SOLOON') {
            return goalObject.color === 'white' ? '⚪' :
                   goalObject.color === 'blue' ? '🔵' :
                   goalObject.color === 'purple' ? '🟣' : '🔴';
          }
          return '🌙';
        case 'COMETH':
          return '☄️';
        default:
          return '🌌';
      }
    }
  };

  const getCellClass = () => {
    if (isGoal) {
      if (!goalObject) return 'grid-cell';
      
      const baseClass = 'grid-cell astral-goal';
      switch (goalObject.type) {
        case 'SOLOON':
          return `${baseClass} soloon-${goalObject.color}`;
        case 'COMETH':
          return `${baseClass} cometh-${goalObject.direction}`;
        default:
          return baseClass;
      }
    } else {
      if (!currentValue || currentValue === 'SPACE') {
        return 'grid-cell';
      }

      const baseClass = 'grid-cell astral-current';
      if (goalObject?.type === currentValue) {
        if (currentValue === 'SOLOON' && goalObject.type === 'SOLOON') {
          return baseClass + ' soloon-' + goalObject.color;
        }
        if (currentValue === 'COMETH' && goalObject.type === 'COMETH') {
          return baseClass + ' cometh-' + goalObject.direction;
        }
      }
      return baseClass;
    }
  };

  const getTitle = () => {
    const type = isGoal ? 'Goal' : 'Current';
    const value = isGoal ? goalObject?.type || 'Empty' : currentValue;
    return `Row: ${row}, Col: ${col}, ${type}: ${value}`;
  };

  return (
    <div
      className={`${getCellClass()} ${className || ''}`}
      onClick={onClick}
      title={getTitle()}
    >
      {getCellContent()}
    </div>
  );
};

export default GridCell; 