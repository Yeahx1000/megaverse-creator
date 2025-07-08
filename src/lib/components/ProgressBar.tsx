import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

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