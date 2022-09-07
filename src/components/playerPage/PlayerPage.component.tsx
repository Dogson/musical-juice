import classNames from 'classnames';
import React, { useContext } from 'react';

import AppContext from '../../context/app-context/AppContext';
import AtmospheresEffects from '../atmospheres/AtmospheresEffects.component';
import Logo from '../logo/Logo.component';
import YoutubeVideo from '../youtube-video/YoutubeVideo.component';
import * as styles from './PlayerPage.module.scss';

const PlayerPage: React.FC = () => {
  const { currentMood, currentMix, isLoading } = useContext(AppContext);

  return (
    <div className={styles.PlayerPage}>
      <div
        className={classNames(styles.PlayerPage_logoContainer, {
          [styles.PlayerPage_logoContainer__loading]: isLoading,
        })}
      >
        <Logo scale={0.3} mixMood={currentMood} />
      </div>
      <YoutubeVideo key={currentMix?.id} />
      <AtmospheresEffects />
    </div>
  );
};

export default PlayerPage;
