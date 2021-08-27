import React, { useRef, useState } from 'react';
import YouTube from 'react-youtube';

import useAppContextManager from '../../hooks/useAppContextManager';
import useTracksManager from '../../hooks/useTracksManager';
import { ITrack } from '../../typings/Tracks.types';
import { initTvShader } from '../../utils/badTvShader';
import * as styles from './YoutubeVideo.module.scss';

const YoutubeVideo: React.FC = () => {
  const { currentMix, nextMix } = useAppContextManager();
  const { track, nextTrack, checkTrackWithTimestamp } = useTracksManager(
    currentMix?.tracks as ITrack[],
  );
  const [mixTitle, setMixTitle] = useState('');

  const [player, setPlayer] = useState<YT.Player>();
  const checkTrackNameInterval = useRef<number | null>(null);

  const handleReady = (e: YT.PlayerEvent) => {
    initTvShader(styles.YoutubeVideo_videoContainer, currentMix?.gifs[0]);
    setPlayer(e.target);
    e.target.seekTo(0, true);
    e.target.playVideo();
    setMixTitle((e.target as unknown as any).playerInfo.videoData.title);
  };

  const handlePlay = () => {
    if (checkTrackNameInterval.current || !player) return;
    checkTrackNameInterval.current = window.setInterval(() => {
      checkTrackWithTimestamp(player.getCurrentTime());
    }, 1000);
  };

  const handlePause = () => {
    if (!checkTrackNameInterval.current) return;
    clearInterval(checkTrackNameInterval.current);
    checkTrackNameInterval.current = null;
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
