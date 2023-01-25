import classNames from 'classnames';
import React, { useContext, useState } from 'react';

import AppContext from '../../context/app-context/AppContext';
import Button, { Icons } from '../buttons/Button.component';
import Logo from '../logo/Logo.component';
import PlayerPage from '../playerPage/PlayerPage.component';
import * as styles from './Homepage.module.scss';

const Homepage: React.FC = () => {
  const {
    moods,
    setCurrentMood,
    currentMood,
    atmospheres,
    setCurrentAtmosphere,
    currentAtmosphere,
    currentMix,
  } = useContext(AppContext);
  const [launchPlayer, setLaunchPlayer] = useState(false);

  const handleStart = () => {
    setLaunchPlayer(true);
  };

  return launchPlayer ? (
    <PlayerPage />
  ) : (
    <div role="button" className={styles.Homepage}>
      <div className={styles.Homepage_logoContainer}>
        <Logo />
      </div>
      <div className={styles.Homepage_options}>
        <div className={styles.Homepage_optionBlock}>
          <div>Choose musical channel</div>
          <div className={styles.Homepage_optionsBlockButtons}>
            {moods.map((mood) => (
              <Button
                onClick={() => setCurrentMood(mood)}
                label={mood}
                active={mood === currentMood}
              />
            ))}
          </div>
        </div>
        <div className={styles.Homepage_optionBlock}>
          <div>Choose ambient sound</div>
          <div className={styles.Homepage_optionsBlockButtons}>
            {atmospheres.map((atmosphere) => (
              <Button
                onClick={() =>
                  setCurrentAtmosphere(
                    atmosphere === currentAtmosphere ? undefined : atmosphere,
                  )
                }
                icon={atmosphere as unknown as Icons}
                active={atmosphere === currentAtmosphere}
              />
            ))}
          </div>
        </div>

        <div
          className={classNames(styles.Homepage_optionBlock, {
            [styles.hidden]: !currentMix,
          })}
        >
          <Button
            onClick={handleStart}
            disabled={!currentMix}
            icon={Icons.Play}
            noBackground
            label={<div>start</div>}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
