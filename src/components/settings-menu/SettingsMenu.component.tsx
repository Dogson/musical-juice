import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useAppContextManager from '../../hooks/useAppContextManager';
import useOutsideClickHandler from '../../hooks/useOutsideClickHandler';
import Button, { Icons } from '../buttons/Button.component';
import SettingsIcon from '../icons/SettingsIcon.component';
import VolumeSlider from '../volume-slider/VolumeSlider.component';
import * as styles from './SettingsMenu.module.scss';

const SettingsMenu: React.FC<{
  onOpen: () => void;
  onClose: () => void;
}> = ({ onOpen, onClose }) => {
  const [opened, setOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    atmospheres,
    currentAtmosphere,
    changeAtmosphere,
    moods,
    currentMood,
    changeMood,
    mixes,
  } = useAppContextManager();
  const { t } = useTranslation();

  useOutsideClickHandler(containerRef, () => {
    setOpened(false);
  });

  useEffect(() => (opened ? onOpen() : onClose()), [onClose, onOpen, opened]);

  return (
    <div
      role="button"
      className={classNames(styles.SettingsMenu, {
        [styles.SettingsMenu__opened]: opened,
      })}
      onClick={() => setOpened(true)}
      ref={containerRef}
    >
      {opened ? (
        <div
          className={classNames(
            'animate__animated animate__fadeIn',
            styles.SettingsMenu_container,
          )}
        >
          <div className={styles.SettingsMenu_block}>
            <div className={styles.SettingsMenu_blockLabel}>
              {t('settings.channel')}
            </div>
            <div className={styles.SettingsMenu_row}>
              <div className={styles.SettingsMenu_buttons}>
                {moods.map((mood) => (
                  <Button
                    onClick={() => changeMood(mood)}
                    label={
                      mood === 'favs' ? (
                        <div className={styles.SettingsMenu_moodFavBtn}>
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
            <div className={styles.SettingsMenu_row}>
              <div className={styles.SettingsMenu_rowLabel}>
                {t('settings.musicVolume')}
              </div>
              <VolumeSlider type="music" />
            </div>
          </div>

          <div className={styles.SettingsMenu_block}>
            <div className={styles.SettingsMenu_blockLabel}>
              {t('settings.ambientSound')}
            </div>
            <div className={styles.SettingsMenu_row}>
              <div className={styles.SettingsMenu_buttons}>
                {atmospheres.map((atmosphere) => (
                  <Button
                    onClick={() =>
                      changeAtmosphere(
                        atmosphere === currentAtmosphere
                          ? undefined
                          : atmosphere,
                      )
                    }
                    icon={atmosphere as unknown as Icons}
                    active={atmosphere === currentAtmosphere}
                  />
                ))}
              </div>
            </div>
            <div className={styles.SettingsMenu_row}>
              <div className={styles.SettingsMenu_rowLabel}>
                {t('settings.ambientSoundVolume')}
              </div>
              <VolumeSlider type="sound" />
            </div>
          </div>
        </div>
      ) : (
        <SettingsIcon />
      )}
    </div>
  );
};

export default SettingsMenu;
