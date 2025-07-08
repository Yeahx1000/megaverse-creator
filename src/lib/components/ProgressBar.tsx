import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

// updating large amounts of data is a bit slow right now, so I added a progress bar for user to see it's doing something
const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  if (total === 0) return null;

  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${percentage}%` }}
      />
      <span className="progress-text">
        {completed} / {total} ({percentage}%)
      </span>
    </div>
  );
};

export default ProgressBar; 