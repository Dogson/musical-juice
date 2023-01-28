import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import YouTube from 'react-youtube';
import useSound from 'use-sound';

import AppContext from '../../context/app-context/AppContext';
import useAppContextManager from '../../hooks/useAppContextManager';
import useTracksManager from '../../hooks/useTracksManager';
import { ITrack } from '../../typings/Tracks.types';
import { IWindow } from '../../typings/Window.types';
import { initTvShader } from '../../utils/badTvShader';
import Button, { Icons } from '../buttons/Button.component';
import fastForwardSound from './assets/fast-forward.wav';
import staticSound from './assets/static.wav';
import * as styles from './YoutubeVideo.module.scss';

const YoutubeVideo: React.FC = () => {
  const isBrowser = typeof window !== 'undefined';
  const {
    currentMix,
    nextMix,
    addOrRemoveCurrentMixToFavs,
    mixes,
    currentMood,
  } = useAppContextManager();
  const { musicVolume } = useContext(AppContext);
  const { setAtmospherePaused, setIsLoading } = useContext(AppContext);
  const [playStaticSound, { stop: stopStaticSound }] = useSound(staticSound, {
    volume: 0.1,
    loop: true,
    interrupt: true,
  });
  const [playFastForwardSound, { stop: stopFastForwardSound }] = useSound(
    fastForwardSound,
    { loop: true, interrupt: true },
  );
  const {
    track,
    nextTrack,
    previousTrack,
    checkTrackWithTimestamp,
    previousTrackTitle,
    nextTrackTitle,
    totalTracks,
  } = useTracksManager(currentMix?.tracks as ITrack[]);
  const [player, setPlayer] = useState<YT.Player>();
  const [author, setAuthor] = useState('');
  const [skippingTrack, setSkippingTrack] = useState<
    'next' | 'previous' | null
  >();
  const [skipTrackAnim, setSkipTrackAnim] = useState<'next' | 'previous'>();
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const timeoutRef = useRef<number>();
  const [videoPaused, setVideoPaused] = useState<boolean>();
  const [manualInterval, setManualInterval] = useState(0);
  const [backgroundVideoLoaded, setBackgroundVideoLoaded] = useState(false);
  const checkTrackNameInterval = useRef<number | null>(null);
  const eWindow: IWindow = window as unknown as IWindow;
  const { t } = useTranslation();

  /**
   * Set Youtube Player, get video title, and autoplay video
   */
  const handleReady = (e: YT.PlayerEvent) => {
    setPlayer(e.target);
    e.target.seekTo(track?.start || 0, true);
    e.target.playVideo();
  };

  const allLoaded = useMemo(
    () => videoLoaded && backgroundVideoLoaded,
    [backgroundVideoLoaded, videoLoaded],
  );

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
    if (player) {
      player.setVolume(musicVolume * 100);
    }
  }, [musicVolume, player]);

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
      setSkippingTrack(null);
      setAtmospherePaused(true);
      return;
    }
    if (videoPaused !== undefined) {
      window.dispatchEvent(eWindow.playVideo);
    } else {
      setVideoLoaded(true);
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

  const handleGoToTrack = (direction: 'previous' | 'next') => {
    if (!player) return;
    const goToTrack = direction === 'previous' ? previousTrack() : nextTrack();
    if (goToTrack) {
      setSkippingTrack(direction);
      setAtmospherePaused(true);
      if (checkTrackNameInterval.current) {
        clearInterval(checkTrackNameInterval.current);
        checkTrackNameInterval.current = null;
        setManualInterval(0);
      }
      player.playVideo();
      player.seekTo(goToTrack.start, true);
    }
  };

  const handleNextTrack = () => {
    setSkipTrackAnim('next');
    handleGoToTrack('next');
  };

  const handlePreviousTrack = () => {
    setSkipTrackAnim('previous');
    handleGoToTrack('previous');
  };

  const handlePauseClick = () => {
    if (!player) return;
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
    if (!allLoaded || !player) {
      setAtmospherePaused(true);
      playStaticSound();
      setIsLoading(true);
    } else {
      initTvShader(styles.YoutubeVideo_videoContainer, currentMix?.gif);
      stopStaticSound();
      setAtmospherePaused(false);
      setIsLoading(false);
      player.playVideo();
    }
  }, [
    allLoaded,
    currentMix?.gif,
    playStaticSound,
    player,
    setAtmospherePaused,
    setIsLoading,
    stopStaticSound,
    track?.start,
  ]);

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
    [currentMix, stopStaticSound, allLoaded],
  );
  /**
   * Preloading video + showing static when changing mix
   */
  useEffect(() => {
    setAtmospherePaused(undefined);
    setVideoLoaded(false);
    setBackgroundVideoLoaded(false);
  }, [currentMix, setAtmospherePaused]);

  return (
    <div className={styles.YoutubeVideo}>
      {currentMix && (
        <video
          id="background-video"
          src={currentMix?.gif}
          onLoadedData={() => {
            setBackgroundVideoLoaded(true);
          }}
        />
      )}
      {allLoaded && (
        <div className={styles.YoutubeVideo_interactiveLayer} role="button">
          <div className={styles.YoutubeVideo_topInfos}>
            <h3 className="animate__animated animate__fadeInDown">
              {currentMix && (
                <a href={currentMix.url} target="_blank" rel="noreferrer">
                  {author}
                </a>
              )}
            </h3>
            <div className={styles.YoutubeVideo_titleWrapper}>
              <h1 className="animate__animated animate__jackInTheBox">
                {currentMix?.title}
              </h1>
            </div>
            <div className="animate__animated animate__fadeInUp">
              <Button
                onClick={addOrRemoveCurrentMixToFavs}
                active={
                  currentMix &&
                  mixes.find((mix) => mix.id === currentMix.id)?.fav
                }
                icon={Icons.Favorite}
                size="smaller"
              />
            </div>
          </div>

          <div className={styles.YoutubeVideo_bottomInfos}>
            {!skippingTrack ? (
              <h2
                className={classNames(
                  styles.YoutubeVideo_trackInfos,
                  'animate__animated',
                  skipTrackAnim === 'next'
                    ? 'animate__fadeInRight'
                    : 'animate__fadeInLeft',
                )}
              >
                <div className={styles.YoutubeVideo_trackPosition}>
                  {t('player.track')} {track?.position}/{totalTracks}
                </div>
                <div className={styles.YoutubeVideo_trackTitle}>
                  {track?.title}
                </div>
              </h2>
            ) : (
              <h2
                className={classNames(
                  styles.YoutubeVideo_trackInfos,
                  'animate__animated',
                  skippingTrack === 'next'
                    ? 'animate__fadeOutLeft'
                    : 'animate__fadeOutRight',
                )}
              >
                <div className={styles.YoutubeVideo_trackPosition}>
                  Track{' '}
                  {track &&
                    (skippingTrack === 'next'
                      ? track.position - 1
                      : track.position + 1)}
                  /{totalTracks}
                </div>
                <div className={styles.YoutubeVideo_trackTitle}>
                  {skippingTrack === 'next'
                    ? previousTrackTitle
                    : nextTrackTitle}
                </div>
              </h2>
            )}
            <div className={styles.YoutubeVideo_playerButtons}>
              <Button
                onClick={handlePreviousTrack}
                size="smaller"
                icon={Icons.Backward}
                active={skippingTrack === 'previous'}
                disabled={!track || track.position === 1 || !!skippingTrack}
              />
              <Button
                onClick={handlePauseClick}
                size="smaller"
                icon={videoPaused ? Icons.Play : Icons.Pause}
                active={videoPaused}
                disabled={!!skippingTrack}
              />
              <Button
                onClick={handleNextTrack}
                size="smaller"
                icon={Icons.Forward}
                active={skippingTrack === 'next'}
                disabled={
                  !track || track.position === totalTracks || !!skippingTrack
                }
              />
            </div>

            <Button
              onClick={nextMix}
              icon={Icons.Shuffle}
              label={
                <div className={styles.YoutubeVideo_nextMixBtn}>
                  {t('player.changeMix', { mood: currentMood })}
                </div>
              }
              noBackground
            />
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
