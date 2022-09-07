import React from 'react';

const ForwardIcon: React.FC<{ color?: string }> = ({
  color = 'var(--color-main)',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-player-skip-forward"
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
    <path d="M4 5v14l12 -7z" />
    <line x1="20" y1="5" x2="20" y2="19" />
  </svg>
);

export default ForwardIcon;
