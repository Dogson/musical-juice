import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';

import useAppContextManager from '../../hooks/useAppContextManager';
import useTracksManager from '../../hooks/useTracksManager';
import { ITrack } from '../../typings/Tracks.types';
import { IWindow } from '../../typings/Window.types';
import { initTvShader } from '../../utils/badTvShader';
import * as styles from './YoutubeVideo.module.scss';

const YoutubeVideo: React.FC = () => {
  const { currentMix, nextMix } = useAppContextManager();
  const { track, nextTrack, checkTrackWithTimestamp } = useTracksManager(
    currentMix?.tracks as ITrack[],
  );
  const [mixTitle, setMixTitle] = useState('');

  const [player, setPlayer] = useState<YT.Player>();
  const [paused, setPaused] = useState();
  const checkTrackNameInterval = useRef<number | null>(null);
  const eWindow: IWindow = window;

  /**
   * Set Youtube Player, get video title, and autoplay video
   */
  const handleReady = (e: YT.PlayerEvent) => {
    setPlayer(e.target);
    e.target.seekTo(0, true);
    e.target.playVideo();
    setMixTitle((e.target as unknown as any).playerInfo.videoData.title);
  };

  /**
   * Initializing interval to check if timestamp corresponds to a new track
   * Stop showing static to show the gif
   */
  const handlePlay = () => {
    if (checkTrackNameInterval.current || !player) return;
    checkTrackNameInterval.current = window.setInterval(() => {
      checkTrackWithTimestamp(player.getCurrentTime());
    }, 1000);
    if (paused !== undefined) {
      window.dispatchEvent(eWindow.playVideo);
    } else {
      initTvShader(styles.YoutubeVideo_videoContainer, currentMix?.gifs[0]);
    }
  };

  const handlePause = () => {
    if (!checkTrackNameInterval.current) return;
    clearInterval(checkTrackNameInterval.current);
    checkTrackNameInterval.current = null;
    window.dispatchEvent(eWindow.pauseVideo);
  };

  const handleEnd = () => {
    if (!checkTrackNameInterval.current) return;
    clearInterval(checkTrackNameInterval.current);
    checkTrackNameInterval.current = null;
  };

  const handleError = () => {
    // TODO handleError
  };

  const handleNextTrack = () => {
    if (!player) return;
    const next = nextTrack();
    if (next) {
      player.playVideo();
      player.seekTo(next.start, true);
    }
  };

  useEffect(() => {
    if (paused === undefined || !player) return;
    if (paused) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [paused, player]);
  /**
   * Preloading video + showing static when changing mix
   */
  useEffect(() => {
    setPaused(undefined);
    initTvShader(styles.YoutubeVideo_videoContainer, currentMix?.gifs[0]);
    initTvShader(styles.YoutubeVideo_videoContainer, null, true);
  }, [currentMix]);

  return (
    <div className={styles.YoutubeVideo}>
      <div className={styles.YoutubeVideo_interactiveLayer}>
        <h1>{mixTitle}</h1>
        <h2>{track?.title}</h2>
        <button type="button" onClick={handleNextTrack}>
          Chanson suivante !
        </button>
        <button type="button" onClick={nextMix}>
          Mix suivant !
        </button>
        <button type="button" onClick={() => setPaused((v) => !v)}>
          Pause
        </button>
      </div>
      <div className={styles.YoutubeVideo_videoContainer}>
        <YouTube
          videoId={currentMix?.id}
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

export default YoutubeVideo;
