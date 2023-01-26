import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import useAppContextManager from '../../hooks/useAppContextManager';
import useOutsideClickHandler from '../../hooks/useOutsideClickHandler';
import Button, { Icons } from '../buttons/Button.component';
import SettingsIcon from '../icons/SettingsIcon.component';
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
          <div className={styles.SettingsMenu_row}>
            <div className={styles.SettingsMenu_rowLabel}>Change channel</div>
            <div className={styles.SettingsMenu_buttons}>
              {moods.map((mood) => (
                <Button
                  onClick={() => changeMood(mood)}
                  label={
                    mood === 'favs' ? (
                      <div className={styles.SettingsMenu_moodFavBtn}>
                        <small>Your</small>
                        <div>Favs</div>
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
              Change ambient sounds
            </div>
            <div className={styles.SettingsMenu_buttons}>
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
        </div>
      ) : (
        <SettingsIcon />
      )}
    </div>
  );
};

export default SettingsMenu;
