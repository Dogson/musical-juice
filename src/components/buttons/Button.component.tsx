import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import useSound from 'use-sound';

import buttonPressSound from '../../assets/button-press.mp3';
import BackwardIcon from '../icons/BackwardIcon.component';
import ForwardIcon from '../icons/ForwardIcon.component';
import PauseIcon from '../icons/PauseIcon.component';
import PlayIcon from '../icons/PlayIcon.component';
import ShuffleIcon from '../icons/ShuffleIcon.component';
import * as styles from './Button.module.scss';

export const enum Icons {
  Play,
  Pause,
  Shuffle,
  Forward,
  Backward,
}

const Button: React.FC<{
  onClick: () => void;
  label?: React.ReactNode;
  icon?: Icons;
  size?: 'small' | 'normal';
  active?: boolean;
  timeout?: number;
}> = ({
  onClick,
  label = '',
  icon,
  size = 'normal',
  active = false,
  timeout = 0,
}) => {
  const [play] = useSound(buttonPressSound);
  const [hasClicked, setHasClicked] = useState(false);

  const handleClick = () => {
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
      default:
        return null;
    }
  }, [icon]);

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => play()}
      type="button"
      className={classNames(styles.Button, {
        [styles.Button__small]: size === 'small',
        [styles.Button__active]: active || hasClicked,
      })}
    >
      {iconComponent && iconComponent}
      {label}
    </button>
  );
};

export default Button;
