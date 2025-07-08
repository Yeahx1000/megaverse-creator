import React from 'react';

interface GridControlsProps {
  loading: boolean;
  goalMap: any;
  isPaused: boolean;
  onCreateGoalPattern: () => void;
  onClearGrid: () => void;
  onTogglePause: () => void;
  onShowGoalMap: () => void;
}

const GridControls: React.FC<GridControlsProps> = ({
  loading,
  goalMap,
  isPaused,
  onCreateGoalPattern,
  onClearGrid,
  onTogglePause,
  onShowGoalMap
}) => {
  return (
    <div className="controls">
      <button 
        onClick={onCreateGoalPattern}
        disabled={loading || !goalMap}
        className="btn btn-create"
      >
        {loading ? 'Creating...' : 'Create Goal Pattern'}
      </button>
      
      {loading && (
        <button 
          onClick={onTogglePause}
          className="btn btn-pause"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      )}
      
      <button 
        onClick={onClearGrid}
        disabled={loading || !goalMap}
        className="btn btn-delete"
      >
        {loading ? 'Clearing...' : 'Clear Grid'}
      </button>

      <button 
        onClick={onShowGoalMap}
        disabled={!goalMap}
        className="btn btn-info"
      >
        Show Goal Map
      </button>
    </div>
  );
};

export default GridControls; 