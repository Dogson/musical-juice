import React from 'react';

const BackwardIcon: React.FC<{ color?: string }> = ({
  color = 'var(--color-main)',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-player-skip-back"
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
    <path d="M20 5v14l-12 -7z" />
    <line x1="4" y1="5" x2="4" y2="19" />
  </svg>
);

export default BackwardIcon;
