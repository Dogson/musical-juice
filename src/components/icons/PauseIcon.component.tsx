import React from 'react';

const PauseIcon: React.FC<{ color?: string }> = ({
  color = 'var(--color-main)',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-player-pause"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke={color}
    fill={color}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);

export default PauseIcon;
