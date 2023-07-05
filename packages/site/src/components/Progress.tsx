import React from 'react';

interface Props {
  percent: number | string;
}

export type { Props as ProgressProps };

export const Progress: React.FC<Props> = ({ percent }) => {
  return (
    <div style={{ height: 20, position: 'relative' }}>
      <div
        style={{
          width: `${percent}%`,
          transition: 'width .1s',
          height: '100%',
          borderRadius: 16,
          backgroundImage: 'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)',
          overflow: 'visible',
        }}
      >
        <span style={{ fontSize: 12, marginLeft: 8 }}>{percent}%</span>
      </div>
    </div>
  );
};
