import { useCallback, useEffect, useState } from 'react';

import { ITrack } from '../typings/Tracks.types';
import useAppContextManager from './useAppContextManager';
import { IUseTracksManager } from './useTracksManager.types';

const useTracksManager = (tracks: ITrack[]): IUseTracksManager => {
  const { nextMix } = useAppContextManager();
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [loadingNextTrack, setLoadingNextTrack] = useState(false);

  useEffect(() => {
    setLoadingNextTrack(false);
  }, [currentTrackIdx]);

  const nextTrack = useCallback(() => {
    if (!tracks || loadingNextTrack) return null;
    setLoadingNextTrack(true);
    if (currentTrackIdx < tracks.length - 1) {
      setCurrentTrackIdx((v) => v + 1);
      return tracks[currentTrackIdx + 1];
    }
    nextMix();
    return null;
  }, [currentTrackIdx, loadingNextTrack, nextMix, tracks]);

  const checkTrackWithTimestamp = useCallback(
    (timestamp: number) => {
      const nextTrackIdx = tracks.findIndex((song) => song.start > timestamp);

      const timestampTrackIdx =
        nextTrackIdx === -1 ? tracks.length - 1 : nextTrackIdx - 1;

      setCurrentTrackIdx((v) => {
        if (v !== timestampTrackIdx) nextTrack();
        return v;
      });
    },
    [nextTrack, tracks],
  );

  return {
    nextTrack,
    track: tracks ? tracks[currentTrackIdx] : undefined,
    checkTrackWithTimestamp,
  };
};

export default useTracksManager;
