import React from 'react';
import { AstralObject, MegaverseObject } from '../types';
import GridCell from './GridCell';

interface GridProps {
  rows: number;
  cols: number;
  goalMap: any;
  currentMap: any;
  getGoalObject: (row: number, col: number) => MegaverseObject | null;
  getCurrentValue: (row: number, col: number) => AstralObject;
  onCellClick?: (row: number, col: number, currentValue: AstralObject) => void;
  isGoal?: boolean;
}

const Grid: React.FC<GridProps> = ({
  rows,
  cols,
  goalMap,
  currentMap,
  getGoalObject,
  getCurrentValue,
  onCellClick,
  isGoal = false
}) => {
  if (rows === 0 || cols === 0) {
    return (
      <div className="loading-container">
        <p>Loading grid data...</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {Array.from({ length: cols }, (_, colIndex) => {
            const currentValue = getCurrentValue(rowIndex, colIndex);
            const goalObject = getGoalObject(rowIndex, colIndex);
            
            return (
              <GridCell
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                currentValue={currentValue}
                goalObject={goalObject}
                isGoal={isGoal}
                onClick={() => onCellClick?.(rowIndex, colIndex, currentValue)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid; 