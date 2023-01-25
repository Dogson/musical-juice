import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import useSound from 'use-sound';

import buttonPressSound from '../../assets/button-press.mp3';
import BackwardIcon from '../icons/BackwardIcon.component';
import FireplaceIcon from '../icons/FireplaceIcon.component';
import ForwardIcon from '../icons/ForwardIcon.component';
import NatureIcon from '../icons/NatureIcon.component';
import PauseIcon from '../icons/PauseIcon.component';
import PlayIcon from '../icons/PlayIcon.component';
import RainIcon from '../icons/RainIcon.component';
import ShuffleIcon from '../icons/ShuffleIcon.component';
import * as styles from './Button.module.scss';

export const enum Icons {
  Play,
  Pause,
  Shuffle,
  Forward,
  Backward,
  Rain = 'rain',
  Fireplace = 'fireplace',
  Nature = 'nature',
}

const Button: React.FC<{
  onClick: () => void;
  label?: React.ReactNode;
  icon?: Icons;
  size?: 'small' | 'normal';
  active?: boolean;
  timeout?: number;
  disabled?: boolean;
  noBackground?: boolean;
}> = ({
  onClick,
  label = '',
  icon,
  size = 'normal',
  active = false,
  timeout = 0,
  disabled = false,
  noBackground = false,
}) => {
  const [play] = useSound(buttonPressSound);
  const [hasClicked, setHasClicked] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setHasClicked(true);
    setTimeout(() => {
      onClick();
      setHasClicked(false);
    }, timeout);
  };

  const iconComponent = useMemo(() => {
    switch (icon) {
      case Icons.Shuffle:
        return <ShuffleIcon />;
      case Icons.Pause:
        return <PauseIcon />;
      case Icons.Play:
        return <PlayIcon />;
      case Icons.Forward:
        return <ForwardIcon />;
      case Icons.Backward:
        return <BackwardIcon />;
      case Icons.Rain:
        return <RainIcon />;
      case Icons.Nature:
        return <NatureIcon />;
      case Icons.Fireplace:
        return <FireplaceIcon />;
      default:
        return null;
    }
  }, [icon]);

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={() => play()}
      type="button"
      className={classNames(styles.Button, {
        [styles.Button__small]: size === 'small',
        [styles.Button__active]: active || hasClicked,
        [styles.Button__disabled]: disabled,
        [styles.Button__noBackground]: noBackground,
      })}
    >
      {iconComponent && iconComponent}
      {label}
    </button>
  );
};

export default Button;
