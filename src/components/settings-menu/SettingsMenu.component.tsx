import classNames from 'classnames';
import React, { useCallback, useRef, useState } from 'react';

import useAppContextManager from '../../hooks/useAppContextManager';
import useOutsideClickHandler from '../../hooks/useOutsideClickHandler';
import Button, { Icons } from '../buttons/Button.component';
import SettingsIcon from '../icons/SettingsIcon.component';
import * as styles from './SettingsMenu.module.scss';

const SettingsMenu: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    atmospheres,
    currentAtmosphere,
    changeAtmosphere,
    moods,
    currentMood,
    changeMood,
  } = useAppContextManager();

  useOutsideClickHandler(containerRef, () => {
    setOpened(false);
  });

  const handleChangeMood = useCallback(
    (mood: string) => {
      changeMood(mood);
    },
    [changeMood],
  );

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
                  onClick={() => handleChangeMood(mood)}
                  label={mood}
                  active={currentMood === mood}
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
