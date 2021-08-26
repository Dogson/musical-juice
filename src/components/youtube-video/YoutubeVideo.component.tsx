import React, { useRef, useState } from 'react';
import YouTube from 'react-youtube';

import { initTvShader } from '../../utils/badTvShader';
import {
  getCurrentSong,
  getNextSong,
  getYoutubeSongs,
} from '../../utils/getYoutubeSongs';
import * as styles from './YoutubeVideo.module.scss';

const VIDEO_ID = '35rBGLpYVqc';
const VIDEO_DESCRIPTION =
  '0:00 - Wake Up, Get Up, Get Out There (Persona 5)\n' +
  '4:33 - Burn My Dread -Last Battle- (Persona 3)\n' +
  '7:55 - Rivers In The Desert (Persona 5)\n' +
  '11:35 - Wiping All Out (Persona 3 Portable)\n' +
  '14:12 - Mass Destruction (Persona 3)\n' +
  '17:03 - Dream of Butterfly (Persona)\n' +
  '19:00 - Last Surprise (Persona 5)\n' +
  '22:41 - Will Power (Persona 5)\n' +
  '25:22 - Reach Out To The Truth (Persona 4)\n' +
  '27:50 - You Are Stronger (Persona 5 Scramble)\n' +
  '32:00 - Blooming Villain -Scramble- (Persona 5 Scramble)\n' +
  '35:36 - Brand New Days (Yuyoyuppe Remix - Long Mix) (Persona Dancing P3D & P5D)\n' +
  '37:40 - Take Over (Persona 5 The Royal)\n' +
  '40:46 - Daredevil (Persona 5 Scramble)\n' +
  '45:37 - Mist (Persona 4)\n' +
  '49:12 - A Lone Prayer (Persona)\n' +
  "51:04 - I'll Face Myself -Battle- (Persona 4)\n" +
  '53:46 - Light the Fire Up in the Night -DARK HOUR- (Persona Q)\n' +
  '56:20 - Pull the Trigger (Persona Q2)\n' +
  '59:57 - A Deep Mentality (Persona 3)\n' +
  '1:02:18 - A Blooming Villain (Persona 5)\n' +
  '1:04:39 - Bloody Destiny (Persona)\n' +
  '1:06:30 - Our Strength (Persona Q2)\n' +
  '1:09:45 - Key Plus Words (Persona 4 The Animation)\n' +
  '1:14:06 - Life Will Change (Persona 5)\n' +
  '1:18:15 - Time to Make History (Persona 4 Golden)\n' +
  '1:20:37 - I Believe (Persona 5 The Royal)\n' +
  '1:25:04 - What You Wish For (Persona5  Scramble)\n' +
  "1:27:54 - Battle for Everyone's Souls (Persona 3)\n" +
  '1:32:00 - Keeper of Lust (Persona 5)\n' +
  '1:35:58 - Sumaru TV (Persona 2 Eternal Punishment)\n' +
  '1:37:21 - Maze of Life (P4D Ver.)\n' +
  '1:40:24 - Wait and See (Persona Q2)\n' +
  '1:43:34 - Counter Strike (Persona 5 Scramble)\n' +
  '1:47:57 - Unbreakable Tie (Persona 2 Innocent Sin)\n' +
  '1:51:38 - Additional Boss Battle (Persona 2 Eternal Punishment)\n' +
  '1:54:00 - Fate is In Our Hands (Persona 3 The Movie)\n' +
  '1:56:59 - Darkness (Persona 3 FES)\n' +
  '1:58:25 - Nichirinmaru (Persona 2 Eternal Punishment)\n' +
  '2:00:21 - The Brink of Death (Persona 2 Eternal Punishment)\n' +
  '2:03:43 - Persona Summoners (Persona 3 The Movie)\n' +
  '2:05:44 - The Snow Queen (Persona 3 FES)\n' +
  '2:08:06 - The Wandering Wolf (Persona 4 Arena)\n' +
  '2:11:09 - Ying Yang (Persona 4 The Golden)\n' +
  '2:16:05 - Time for True Revelation (Persona 4 The Animation)\n' +
  '2:18:17 - Dazzling Smile (Persona 4 The Golden)\n' +
  '2:21:17 - Our Moment (Persona Dancing P3D & P5D)\n' +
  '2:24:40 - The Ultimate -Naked Mix- (P4U)\n' +
  '2:28:33 - Break Out Of... -Free Mix- (Persona 4 The ULTIMAX ULTRA SUPLEX HOLD)\n' +
  '2:32:25 - Breaking Through (Persona Trinity Soul) (MUTED DUE TO COPYRIGHT)\n' +
  '2:36:32 - Light the Fire Up In The Night (KAGEJIKAN . MAYONAKA) - sasakure.UK Remix- (Persona Dancing P3D & P5D)\n' +
  '2:40:34 - Break Out Of... (ATLUS Kitajoh Remix) (Persona Dancing P3D & P5D)\n' +
  '2:43:24 - Last Surprise -Scramble- (Persona 5 Scramble)';

const VideoTest: React.FC = () => {
  const songs = getYoutubeSongs(VIDEO_DESCRIPTION);

  const [player, setPlayer] = useState<YT.Player>();
  const [songTitle, setSongTitle] = useState(songs[0].title);
  const [mixTitle, setMixTitle] = useState(songs[0].title);
  const checkSongNameInterval = useRef<number | null>(null);

  const handleReady = (e: YT.PlayerEvent) => {
    initTvShader(styles.YoutubeVideo_videoContainer);
    setPlayer(e.target);
    e.target.seekTo(0, true);
    e.target.playVideo();
    setMixTitle((e.target as unknown as any).playerInfo.videoData.title);
  };

  const handlePlay = () => {
    if (checkSongNameInterval.current || !player) return;
    checkSongNameInterval.current = window.setInterval(() => {
      const currentSong = getCurrentSong(songs, player.getCurrentTime()).title;
      if (currentSong !== songTitle) {
        setSongTitle(currentSong);
      }
    }, 1000);
  };

  const handlePause = () => {
    if (!checkSongNameInterval.current) return;
    clearInterval(checkSongNameInterval.current);
    checkSongNameInterval.current = null;
  };

  const handleEnd = () => {
    if (!checkSongNameInterval.current) return;
    clearInterval(checkSongNameInterval.current);
    checkSongNameInterval.current = null;
  };

  const handleError = () => {
    // TODO handleError
  };

  const handleNextSong = () => {
    if (!player) return;
    const nextSong = getNextSong(songs, player.getCurrentTime());
    if (nextSong) {
      player.playVideo();
      player.seekTo(nextSong.start, true);
      setSongTitle(nextSong.title);
    } else {
      // TODO launch next mix
    }
  };

  return (
    <div className={styles.YoutubeVideo}>
      <div className={styles.YoutubeVideo_interactiveLayer}>
        <h1>{mixTitle}</h1>
        <h2>{songTitle}</h2>
        <button type="button" onClick={handleNextSong}>
          Chanson suivante !
        </button>
      </div>
      <div className={styles.YoutubeVideo_videoContainer}>
        <YouTube
          videoId={VIDEO_ID}
          className={styles.YoutubeVideo_video}
          containerClassName={styles.YoutubeVideo_videoWrapper}
          opts={{
            playerVars: {
              disablekb: 1,
              enablejsapi: 1,
              controls: 0,
              showinfo: 0,
            },
          }} // defaults -> {}
          onReady={(e) => handleReady(e as unknown as YT.PlayerEvent)} // defaults -> noop
          onPlay={handlePlay} // defaults -> noop
          onPause={handlePause} // defaults -> noop
          onEnd={handleEnd} // defaults -> noop
          onError={handleError} // defaults -> noop
        />
      </div>
    </div>
  );
};

export default VideoTest;
