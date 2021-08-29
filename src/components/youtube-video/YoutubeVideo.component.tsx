import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import useSound from 'use-sound';

import useAppContextManager from '../../hooks/useAppContextManager';
import useTracksManager from '../../hooks/useTracksManager';
import { ITrack } from '../../typings/Tracks.types';
import { IWindow } from '../../typings/Window.types';
import { initTvShader } from '../../utils/badTvShader';
import Button from '../buttons/Button.component';
import fastFowardSound from './assets/fast-forward.wav';
import staticSound from './assets/static.wav';
import * as styles from './YoutubeVideo.module.scss';

const YoutubeVideo: React.FC = () => {
  const isBrowser = typeof window !== 'undefined';
  const { currentMix, nextMix } = useAppContextManager();
  const [playStaticSound, { stop: stopStaticSound }] = useSound(staticSound, {
    volume: 0.3,
    loop: true,
  });
  const [playFastFowardSound, { stop: stopFastFowardSound }] = useSound(
    fastFowardSound,
    { loop: true },
  );
  const { track, nextTrack, checkTrackWithTimestamp } = useTracksManager(
    currentMix?.tracks as ITrack[],
  );
  const [mixTitle, setMixTitle] = useState('');
  const [player, setPlayer] = useState<YT.Player>();
  const [paused, setPaused] = useState<boolean>();
  const [skippingTrack, setSkippingTrack] = useState<boolean>();
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [manualInterval, setManualInterval] = useState(0);
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
    if (checkTrackNameInterval.current || !player || !isBrowser) return;
    checkTrackNameInterval.current = window.setInterval(() => {
      setManualInterval((v) => v + 1);
    }, 1000);
    if (skippingTrack) {
      setSkippingTrack(false);
      return;
    }
    if (paused !== undefined) {
      window.dispatchEvent(eWindow.playVideo);
    } else {
      setVideoLoaded(true);
      initTvShader(styles.YoutubeVideo_videoContainer, currentMix?.gifs[0]);
    }
  };

  const handlePause = () => {
    if (!isBrowser) return;
    if (!checkTrackNameInterval.current) return;
    clearInterval(checkTrackNameInterval.current);
    checkTrackNameInterval.current = null;
    setManualInterval(0);
    window.dispatchEvent(eWindow.pauseVideo);
  };

  const handleEnd = () => {
    if (!checkTrackNameInterval.current) return;
    clearInterval(checkTrackNameInterval.current);
    checkTrackNameInterval.current = null;
    setManualInterval(0);
    nextMix();
  };

  const handleError = () => {
    // TODO handleError
  };

  const handleNextTrack = () => {
    if (!player) return;
    const next = nextTrack();
    if (next) {
      setSkippingTrack(true);
      if (checkTrackNameInterval.current) {
        clearInterval(checkTrackNameInterval.current);
        checkTrackNameInterval.current = null;
        setManualInterval(0);
      }
      player.playVideo();
      player.seekTo(next.start, true);
    }
  };

  /**
   * Check timestamp when the manual interval is updated
   * (necessary to get the correct state in the useTrackManager hook, impossible with a regular interval)
   */
  useEffect(() => {
    if (!player || manualInterval === 0) return;
    checkTrackWithTimestamp(player.getCurrentTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, manualInterval]);

  /**
   * Play/pause video
   */
  useEffect(() => {
    if (paused === undefined || !player) return;
    if (paused) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [paused, player]);

  useEffect(() => {
    if (!videoLoaded) playStaticSound();
    else stopStaticSound();
  }, [playStaticSound, stopStaticSound, videoLoaded]);

  useEffect(() => {
    if (skippingTrack !== undefined) {
      if (skippingTrack) {
        playFastFowardSound();
        window.dispatchEvent(eWindow.skipStart);
      } else {
        stopFastFowardSound();
        window.dispatchEvent(eWindow.skipEnd);
      }
    }
  }, [
    eWindow.skipEnd,
    eWindow.skipStart,
    playFastFowardSound,
    skippingTrack,
    stopFastFowardSound,
  ]);

  /**
   * Preloading video + showing static when changing mix
   */
  useEffect(() => {
    setPaused(undefined);
    setVideoLoaded(false);
    initTvShader(styles.YoutubeVideo_videoContainer, currentMix?.gifs[0]);
    initTvShader(styles.YoutubeVideo_videoContainer, null, true);
  }, [currentMix]);

  return (
    <div className={styles.YoutubeVideo}>
      <div className={styles.YoutubeVideo_interactiveLayer}>
        <h1>{mixTitle}</h1>
        <h2>{track?.title}</h2>
        <Button onClick={handleNextTrack}>Chanson suivante !</Button>
        <Button onClick={nextMix}>Mix suivant !</Button>
        <Button onClick={() => setPaused(!paused)}>Pause</Button>
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
