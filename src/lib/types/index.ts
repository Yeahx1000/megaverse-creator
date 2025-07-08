export type Direction = 'up' | 'down' | 'left' | 'right';
export type SoloonColor = 'white' | 'blue' | 'purple' | 'red';

export type AstralObject = 'SPACE' | 'POLYANET' | 'SOLOON' | 'COMETH';

interface BaseAstralObject {
  row?: number;
  col?: number;
}

export interface Polyanet extends BaseAstralObject {
  type: 'POLYANET';
}

export interface Soloon extends BaseAstralObject {
  type: 'SOLOON';
  color: SoloonColor;
}

export interface Cometh extends BaseAstralObject {
  type: 'COMETH';
  direction: Direction;
}

export type MegaverseObject = Polyanet | Soloon | Cometh;

export interface MegaverseMap {
  map: (AstralObject | null)[][];
  objects: MegaverseObject[];
}

export const parseGoalString = (str: string): MegaverseObject | null => {
  if (str === 'SPACE' || !str) return null;

  if (str === 'POLYANET') {
    return { type: 'POLYANET' };
  }

  const soloonMatch = str.match(/^(WHITE|BLUE|PURPLE|RED)_SOLOON$/);
  if (soloonMatch) {
    return {
      type: 'SOLOON',
      color: soloonMatch[1].toLowerCase() as SoloonColor
    };
  }

  const comethMatch = str.match(/^(UP|DOWN|LEFT|RIGHT)_COMETH$/);
  if (comethMatch) {
    return {
      type: 'COMETH',
      direction: comethMatch[1].toLowerCase() as Direction
    };
  }

  return null;
};

export interface AstralObjectOperation {
  row: number;
  column: number;
  object: MegaverseObject;
}