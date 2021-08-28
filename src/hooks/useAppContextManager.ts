import { useCallback, useContext, useEffect } from 'react';

import appData from '../../static/mocks/data.json';
import AppContext from '../context/AppContext';
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
   * Load app data (mixes, atmospheres and moods) with gatsby GraphQL queries
   */
  const loadData = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setMixes(
      appData.mixes.map((mix: IMix) => ({
        ...mix,
        tracks: parseYoutubeDescription(mix.description, false),
      })),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setMoods(appData.moods);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setAtmospheres(appData.atmospheres);
    setCurrentMood('groovy');
  }, [setAtmospheres, setCurrentMood, setMixes, setMoods]);

  /**
   * Go to the next mix in the playlist
   */
  const nextMix = useCallback(() => {
    if (!currentMood || !mixPlaylist || mixIdx === undefined) {
      return;
    }
    setMixIdx((v) => (v as number) + 1);
  }, [currentMood, mixIdx, mixPlaylist, setMixIdx]);

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
   * Change current asmosphere
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
    const moodMixes = mixes.filter((mix) => mix.mood === currentMood);
    const randomPlaylist = shuffleMix(moodMixes);
    setMixPlaylist(randomPlaylist);
    setMixIdx(0);
  }, [currentMood, mixPlaylist, mixes, setMixIdx, setMixPlaylist]);

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
