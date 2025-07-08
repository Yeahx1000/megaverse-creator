import React from 'react';

interface GridLegendProps {
  isGoal?: boolean;
}

// just for displaying below grid, to see what's what
const GridLegend: React.FC<GridLegendProps> = ({ isGoal = false }) => {
  if (isGoal) {
    return (
      <div className="grid-legend">
        <div className="legend-item">
          <span className="legend-icon">⭐</span>
          <span>Polyanet</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">⚪</span>
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
  }

  return (
    <div className="grid-legend">
      <div className="legend-item">
        <span className="legend-icon">🪐</span>
        <span>Current Polyanet</span>
      </div>
      <div className="legend-item">
        <span className="legend-icon">🌙</span>
        <span>Current Soloon</span>
      </div>
      <div className="legend-item">
        <span className="legend-icon">☄️</span>
        <span>Current Cometh</span>
      </div>
      <div className="legend-item">
        <span className="legend-icon">🌌</span>
        <span>Empty Space</span>
      </div>
    </div>
  );
};

export default GridLegend; 