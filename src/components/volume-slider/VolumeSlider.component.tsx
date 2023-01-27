import React, { useContext } from 'react';
import ReactSlider from 'react-slider';

import AppContext from '../../context/app-context/AppContext';
import VolumeMuteIcon from '../icons/VolumeMuteIcon.component';
import VolumeUpIcon from '../icons/VolumeUpIcon.component';
import * as styles from './VolumeSlider.module.scss';

const VolumeSlider: React.FC<{ type: 'music' | 'sound' }> = ({ type }) => {
  const { soundVolume, setSoundVolume, musicVolume, setMusicVolume } =
    useContext(AppContext);

  const setVolume = type === 'music' ? setMusicVolume : setSoundVolume;

  const volume = type === 'music' ? musicVolume : soundVolume;

  const max = type === 'music' ? 100 : 40;

  return (
    <div className={styles.VolumeSlider}>
      <div
        className={styles.VolumeSlider_icon}
        role="button"
        onClick={() => setVolume(0)}
      >
        <VolumeMuteIcon color="#dedede" />
      </div>

      <ReactSlider
        className={styles.VolumeSlider_slider}
        thumbClassName={styles.VolumeSlider_thumb}
        trackClassName={styles.VolumeSlider_track}
        min={0}
        max={max}
        value={volume * 100}
        onChange={(val: number) => setVolume(val / 100)}
      />
      <div
        className={styles.VolumeSlider_icon}
        role="button"
        onClick={() => setVolume(max / 100)}
      >
        <VolumeUpIcon color="#dedede" />
      </div>
    </div>
  );
};

export default VolumeSlider;
