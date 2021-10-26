import React, { CSSProperties } from 'react';
import useSound from 'use-sound';

import buttonPressSound from '../../assets/button-press.mp3';
import * as styles from './Button.module.scss';

const Button: React.FC<{ onClick: () => void; label: string }> = ({
  onClick,
  label,
}) => {
  const [play] = useSound(buttonPressSound);
  const handleClick = (e: React.MouseEvent) => {
    play();
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={styles.Button}
      style={{ '--content': label } as CSSProperties}
    >
      {label}
    </button>
  );
};

export default Button;
