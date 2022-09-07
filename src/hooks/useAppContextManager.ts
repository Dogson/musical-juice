import { useCallback, useContext, useEffect } from 'react';

import appData from '../../static/mocks/data.json';
import AppContext from '../context/app-context/AppContext';
import { IMix } from '../typings/Mixes.types';
import parseYoutubeDescription from '../utils/parseYoutubeDescription';
import { IUseAppContextManager } from './useAppContextManager.types';

const useAppContextManager = (): IUseAppContextManager => {
  const {
    mixes,
    mixIdx,
    setMixIdx,
    setAtmospheres,
    currentAtmosphere,
    atmospheres,
    setCurrentMood,
    setMoods,
    currentMood,
    setCurrentMix,
    setMixes,
    currentMix,
    moods,
    setCurrentAtmosphere,
    mixPlaylist,
    setMixPlaylist,
  } = useContext(AppContext);

  /**
   * shuffle an array of mixes
   */
  const shuffleMix = (array: IMix[]) => {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  /**
   * Randomize a playlist and start it
   * Can force an elem to get last
   */
  const randomizePlaylist = useCallback(
    (putInLast?: IMix) => {
      const moodMixes = mixes.filter((mix) => mix.mood === currentMood);
      let elemIndex;

      let randomPlaylist = shuffleMix(
        putInLast ? moodMixes.filter((m) => m.id !== putInLast.id) : moodMixes,
      );
      if (putInLast) {
        elemIndex = moodMixes.findIndex((m) => m.id === putInLast.id);
        if (elemIndex) {
          randomPlaylist = [...randomPlaylist, putInLast];
        }
      }
      setMixPlaylist(randomPlaylist);
      setMixIdx(0);
    },
    [currentMood, mixes, setMixIdx, setMixPlaylist],
  );

  /**
   * Load app data (mixes, atmospheres and moods) with gatsby GraphQL queries
   */
  const loadData = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setMixes(
      (appData.mixes as IMix[]).map((mix: IMix) => ({
        ...mix,
        tracks: parseYoutubeDescription(mix.description, false),
        url: `https://youtube.com/v/${mix.id}`,
      })),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setMoods(appData.moods);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setAtmospheres(appData.atmospheres);
  }, [setAtmospheres, setMixes, setMoods]);

  /**
   * Go to the next mix in the playlist
   */
  const nextMix = useCallback(() => {
    if (!currentMood || !mixPlaylist || mixIdx === undefined) {
      return;
    }
    if (mixIdx < mixPlaylist.length - 1) {
      setMixIdx((v) => (v || 0) + 1);
    } else {
      randomizePlaylist(currentMix);
    }
  }, [
    currentMix,
    currentMood,
    mixIdx,
    mixPlaylist,
    randomizePlaylist,
    setMixIdx,
  ]);

  /**
   * Change current mood
   */
  const changeMood = useCallback(
    (mood: string) => {
      setCurrentMood(mood);
    },
    [setCurrentMood],
  );

  /**
   * Change current atmosphere
   */
  const changeAtmosphere = useCallback(
    (atmosphere: string) => {
      setCurrentAtmosphere(atmosphere);
    },
    [setCurrentAtmosphere],
  );

  /**
   * Update mix when mixIdx changes
   */
  useEffect(() => {
    if (mixIdx !== undefined && mixPlaylist) {
      setCurrentMix(mixPlaylist[mixIdx]);
    }
  }, [mixIdx, mixPlaylist, setCurrentMix]);

  /**
   * Update mixPlaylist and mixIdx when mood changes
   */
  useEffect(() => {
    if (
      !currentMood ||
      (mixPlaylist &&
        mixPlaylist.length > 0 &&
        mixPlaylist[0].mood === currentMood)
    ) {
      return;
    }
    randomizePlaylist();
  }, [currentMood, mixPlaylist, randomizePlaylist]);

  return {
    moods,
    atmospheres,
    mixes,
    currentMood,
    currentAtmosphere,
    currentMix,
    changeMood,
    changeAtmosphere,
    loadData,
    nextMix,
  };
};

export default useAppContextManager;
