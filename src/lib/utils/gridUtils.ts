import { MegaverseMap, AstralObject, MegaverseObject, parseGoalString } from '../types';

// Get the goal value for a specific position
export const getGoalObject = (goalMap: any, row: number, col: number): MegaverseObject | null => {
  if (!goalMap?.goal || !goalMap.goal[row] || !goalMap.goal[row][col]) {
    return null;
  }
  return parseGoalString(goalMap.goal[row][col]);
};

// Get the current value for a specific position
export const getCurrentValue = (currentMap: MegaverseMap | null, row: number, col: number): AstralObject => {
  if (!currentMap?.map || !currentMap.map[row] || currentMap.map[row][col] === null) {
    return 'SPACE';
  }
  return currentMap.map[row][col] as AstralObject;
};

// Update the current map state
export const updateCurrentMap = (currentMap: MegaverseMap | null, row: number, col: number, value: AstralObject | null): MegaverseMap | null => {
  if (!currentMap) return null;
  
  return {
    ...currentMap,
    map: currentMap.map.map((r, i) => 
      i === row 
        ? r.map((c, j) => j === col ? value : c)
        : r
    )
  };
};

// figuring out grid dimensions on load
export const getGridDimensions = (goalMap: any) => {
  if (!goalMap?.goal) return { rows: 0, cols: 0 };
  return {
    rows: goalMap.goal.length,
    cols: goalMap.goal[0]?.length || 0
  };
}; 