import classNames from 'classnames';
import React, { useContext, useState } from 'react';

import AppContext from '../../context/app-context/AppContext';
import AtmospheresEffects from '../atmospheres/AtmospheresEffects.component';
import Logo from '../logo/Logo.component';
import SettingsMenu from '../settings-menu/SettingsMenu.component';
import YoutubeVideo from '../youtube-video/YoutubeVideo.component';
import * as styles from './PlayerPage.module.scss';

const PlayerPage: React.FC = () => {
  const { currentMood, currentMix, isLoading } = useContext(AppContext);
  const [blur, setBlur] = useState(false);

  return (
    <div className={styles.PlayerPage}>
      <div
        className={classNames(styles.PlayerPage_logoContainer, {
          [styles.PlayerPage_logoContainer__loading]: isLoading,
        })}
      >
        <Logo scale={0.3} mixMood={currentMood} />
      </div>
      <div
        className={classNames({ [styles.PlayerPage_ytContainerBlur]: blur })}
      >
        <YoutubeVideo key={currentMix?.id} />
      </div>
      {!isLoading && currentMix && (
        <div className={styles.PlayerPage_settings}>
          <SettingsMenu
            onOpen={() => setBlur(true)}
            onClose={() => setBlur(false)}
          />
        </div>
      )}
      <AtmospheresEffects />
    </div>
  );
};

export default PlayerPage;
