import classNames from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import useAppContextManager from '../../hooks/useAppContextManager';
import Button, { Icons } from '../buttons/Button.component';
import Logo from '../logo/Logo.component';
import PlayerPage from '../playerPage/PlayerPage.component';
import * as styles from './Homepage.module.scss';

const Homepage: React.FC = () => {
  const {
    moods,
    changeMood,
    currentMood,
    atmospheres,
    changeAtmosphere,
    currentAtmosphere,
    currentMix,
    mixes,
  } = useAppContextManager();
  const [launchPlayer, setLaunchPlayer] = useState(false);
  const { t } = useTranslation();

  const handleStart = () => {
    setLaunchPlayer(true);
  };

  return launchPlayer ? (
    <PlayerPage />
  ) : (
    <div role="button" className={styles.Homepage}>
      <div className={styles.Homepage_logoContainer}>
        <Logo scale={0.8} />
      </div>
      <div className={styles.Homepage_description}>
        {t('homepage.description')}
      </div>
      <div className={styles.Homepage_options}>
        <div className={styles.Homepage_optionBlock}>
          <div>{t('homepage.chooseChannel')}</div>
          <div className={styles.Homepage_optionsBlockButtons}>
            {moods.map((mood) => (
              <Button
                onClick={() => changeMood(mood)}
                label={
                  mood === 'favs' ? (
                    <div className={styles.Homepage_moodFavBtn}>
                      <small>{t('your')}</small>
                      <div>{t('favs')}</div>
                    </div>
                  ) : (
                    mood
                  )
                }
                active={mood === currentMood}
                disabled={mood === 'favs' && !mixes.find((mix) => mix.fav)}
                icon={mood === 'favs' ? Icons.Favorite : undefined}
              />
            ))}
          </div>
        </div>
        <div className={styles.Homepage_optionBlock}>
          <div>{t(t('homepage.chooseAmbientSound'))}</div>
          <div className={styles.Homepage_optionsBlockButtons}>
            {atmospheres.map((atmosphere) => (
              <Button
                onClick={() =>
                  changeAtmosphere(
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
            label={<div>{t('homepage.start')}</div>}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
