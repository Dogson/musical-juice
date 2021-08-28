import React from 'react';
import useSound from 'use-sound';

import buttonPressSound from './assets/button-press.mp3';

const Button: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({
  onClick,
  children,
}) => {
  const [play] = useSound(buttonPressSound);
  const handleClick = () => {
    play();
    onClick();
  };

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
};

export default Button;
