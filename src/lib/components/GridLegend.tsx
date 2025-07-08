import React from 'react';

interface GridLegendProps {
  isGoal?: boolean;
}

// just for displaying below grid, to see what's what
const GridLegend: React.FC<GridLegendProps> = ({ isGoal = false }) => {

  return (
    <div className="grid-legend">
      <div className="legend-item">
        <span className="legend-icon">🪐</span>
        <span>Polyanet</span>
      </div>
      <div className="legend-item">
        <span className="legend-icon">🌙</span>
        <span>Soloon</span>
      </div>
      <div className="legend-item">
        <span className="legend-icon">☄️</span>
        <span>Cometh</span>
      </div>
      <div className="legend-item">
        <span className="legend-icon">🌌</span>
        <span>Empty Space</span>
      </div>
    </div>
  );
};

export default GridLegend; 