import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiFillFastForward, AiFillForward } from 'react-icons/ai';
import YouTube from 'react-youtube';
import useSound from 'use-sound';

import buttonPressSound from '../../assets/button-press.mp3';
import AppContext from '../../context/app-context/AppContext';
import useAppContextManager from '../../hooks/useAppContextManager';
import useTracksManager from '../../hooks/useTracksManager';
import { ITrack } from '../../typings/Tracks.types';
import { IWindow } from '../../typings/Window.types';
import { initTvShader } from '../../utils/badTvShader';
import Button from '../buttons/Button.component';
import fastForwardSound from './assets/fast-forward.wav';
import staticSound from './assets/static.wav';
import * as styles from './YoutubeVideo.module.scss';

const YoutubeVideo: React.FC = () => {
  const isBrowser = typeof window !== 'undefined';
  const { currentMix, nextMix } = useAppContextManager();
  const { setAtmospherePaused } = useContext(AppContext);
  const [playStaticSound, { stop: stopStaticSound }] = useSound(staticSound, {
    volume: 0.1,
    loop: true,
    interrupt: true,
  });
  const [playFastForwardSound, { stop: stopFastForwardSound }] = useSound(
    fastForwardSound,
    { loop: true, interrupt: true },
  );
  const [playBtnSound] = useSound(buttonPressSound);
  const { track, nextTrack, checkTrackWithTimestamp, previousTrackTitle } =
    useTracksManager(currentMix?.tracks as ITrack[]);
  const [player, setPlayer] = useState<YT.Player>();
  const [author, setAuthor] = useState('');
  const [skippingTrack, setSkippingTrack] = useState<boolean>();
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const timeoutRef = useRef<number>();
  const [videoPaused, setVideoPaused] = useState<boolean>();
  const [manualInterval, setManualInterval] = useState(0);
  const checkTrackNameInterval = useRef<number | null>(null);
  const eWindow: IWindow = window as unknown as IWindow;

  /**
   * Set Youtube Player, get video title, and autoplay video
   */
  const handleReady = (e: YT.PlayerEvent) => {
    setPlayer(e.target);
    e.target.seekTo(0, true);
    e.target.playVideo();
  };

  /**
   * timeout if mix is not charged
   */
  useEffect(() => {
    if (!timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        setVideoLoaded((v) => {
          if (!v) {
            nextMix();
          }
          return v;
        });
      }, 5000);
  }, [currentMix, nextMix]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    if (videoLoaded) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      setAtmospherePaused(true);
      return;
    }
    if (videoPaused !== undefined) {
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
      setAtmospherePaused(true);
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
    if (!player) return;
    playBtnSound();
    setVideoPaused(!videoPaused);
    setAtmospherePaused(!videoPaused);
    if (videoPaused) {
      player.playVideo();
    } else {
      player.pauseVideo();
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

  useEffect(() => {
    if (!videoLoaded) {
      setAtmospherePaused(true);
      playStaticSound();
    } else {
      stopStaticSound();
      setAtmospherePaused(false);
    }
  }, [playStaticSound, setAtmospherePaused, stopStaticSound, videoLoaded]);

  useEffect(() => {
    if (skippingTrack !== undefined) {
      if (skippingTrack) {
        setAtmospherePaused(true);
        playFastForwardSound();
        window.dispatchEvent(eWindow.skipStart);
      } else {
        stopFastForwardSound();
        setAtmospherePaused(false);
        window.dispatchEvent(eWindow.skipEnd);
      }
    }
  }, [
    eWindow.skipEnd,
    eWindow.skipStart,
    playFastForwardSound,
    setAtmospherePaused,
    skippingTrack,
    stopFastForwardSound,
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
    setAtmospherePaused(undefined);
    setVideoLoaded(false);
    initTvShader(styles.YoutubeVideo_videoContainer, currentMix?.gifs[0]);
  }, [currentMix, setAtmospherePaused]);

  return (
    <div className={styles.YoutubeVideo}>
      {videoLoaded && (
        <div
          className={styles.YoutubeVideo_interactiveLayer}
          role="button"
          onClick={handleClickScreen}
        >
          <div className={styles.YoutubeVideo_topInfos}>
            <h1 className="animate__animated animate__fadeIn">
              {currentMix?.title}
            </h1>
            <h3 className="animate__animated animate__fadeIn">
              par{' '}
              {currentMix && (
                <a href={currentMix.url} target="_blank" rel="noreferrer">
                  {author}
                </a>
              )}
            </h3>
          </div>
          <div className={styles.YoutubeVideo_bottomInfos}>
            {!skippingTrack ? (
              <h2
                className={classNames(
                  styles.YoutubeVideo_trackTitle,
                  'animate__animated animate__fadeInLeft',
                )}
              >
                {track?.title}
              </h2>
            ) : (
              <h2
                className={classNames(
                  styles.YoutubeVideo_trackTitle,
                  'animate__animated animate__fadeOutRight',
                )}
              >
                {previousTrackTitle}
              </h2>
            )}
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
      <div
        className={classNames(styles.YoutubeVideo_videoContainer, {
          [styles.YoutubeVideo_videoContainer__hidden]: !videoLoaded,
        })}
      >
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
