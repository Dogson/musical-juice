import React, { useContext } from 'react';

import AppContext from '../../context/app-context/AppContext';
import Button from '../buttons/Button.component';
import Logo from '../logo/Logo.component';
import * as styles from './Homepage.module.scss';

const Homepage: React.FC = () => {
  const { moods, setCurrentMood, currentMood } = useContext(AppContext);

  return (
    <div role="button" className={styles.Homepage}>
      <div className={styles.Homepage_logoContainer}>
        <Logo />
        <div className={styles.Homepage_description}>
          Video game OST mixes made by talented people
        </div>
      </div>
      <div className={styles.Homepage_moods}>
        <div className={styles.Homepage_moodQuestion}>Choose your mood</div>
        <div className={styles.Homepage_moodsButtons}>
          {moods.map((mood) => (
            <Button
              onClick={() => setCurrentMood(mood)}
              label={mood}
              active={mood === currentMood}
              timeout={500}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
