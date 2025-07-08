import React from 'react';

interface GridLegendProps {
  isGoal?: boolean;
}

const GridLegend: React.FC<GridLegendProps> = ({ isGoal = false }) => {
  if (isGoal) {
    return (
      <div className="grid-legend">
        <div className="legend-item">
          <span className="legend-icon">⭐</span>
          <span>Goal Polyanet</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">⚪</span>
          <span>Goal Soloon</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">☄️</span>
          <span>Goal Cometh</span>
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