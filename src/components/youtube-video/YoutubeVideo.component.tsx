import React, { useEffect, useRef, useState } from 'react';
import { AiFillFastForward, AiFillForward } from 'react-icons/ai';
import YouTube from 'react-youtube';
import useSound from 'use-sound';

import buttonPressSound from '../../assets/button-press.mp3';
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
  const [playBtnSound] = useSound(buttonPressSound);
  const { track, nextTrack, checkTrackWithTimestamp } = useTracksManager(
    currentMix?.tracks as ITrack[],
  );
  const [player, setPlayer] = useState<YT.Player>();
  const [author, setAuthor] = useState('');
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
  };

  useEffect(() => {
    if (videoLoaded) {
      console.log((player as any).getVideoData());
      setAuthor((player as any).getVideoData().author);
    }
  }, [player, videoLoaded]);

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

  const handleClickScreen = () => {
    playBtnSound();
    setPaused(!paused);
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

  // cleaning
  useEffect(
    () => () => {
      stopStaticSound();
    },
    [currentMix, stopStaticSound, videoLoaded],
  );
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
      {videoLoaded && (
        <div
          className={styles.YoutubeVideo_interactiveLayer}
          role="button"
          onClick={handleClickScreen}
        >
          <div className={styles.YoutubeVideo_topInfos}>
            <h1>{currentMix?.title}</h1>
            <h3>
              par <strong>{author}</strong>
            </h3>
          </div>
          <div className={styles.YoutubeVideo.bottomInfos}>
            <h2 className={styles.YoutubeVideo_trackTitle}>
              {!skippingTrack ? track?.title : ''}
            </h2>
            <div className={styles.YoutubeVideo_playerButtons}>
              <Button
                onClick={handleNextTrack}
                label={
                  <span className={styles.YoutubeVideo_btn}>
                    <AiFillForward className={styles.YoutubeVideo_btnIcon} />
                    Morceau suivant
                  </span>
                }
              />
              <Button
                onClick={nextMix}
                label={
                  <span className={styles.YoutubeVideo_btn}>
                    <AiFillFastForward
                      className={styles.YoutubeVideo_btnIcon}
                    />
                    Mix suivant
                  </span>
                }
              />
            </div>
          </div>
        </div>
      )}
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
