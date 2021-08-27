import { useEffect, useState } from 'react';

import appData from '../../static/mocks/data.json';
import { IMix } from '../typings/Mixes.types';
import { IUseAppContextManager } from './useAppContextManager.types';

const useAppContextManager = (): IUseAppContextManager => {
  const [moods, setMoods] = useState<string[]>([]);
  const [atmospheres, setAtmospheres] = useState<string[]>([]);
  const [mixes, setMixes] = useState<IMix[]>([]);

  const [currentMood, setCurrentMood] = useState<string>();
  const [currentAtmosphere, setCurrentAtmosphere] = useState<string>();
  const [currentMix, setCurrentMix] = useState<IMix>();

  const [mixPlaylist, setMixPlaylist] = useState<IMix[]>();
  const [mixIdx, setMixIdx] = useState<number>();

  /**
   * shuffle an array of mixes
   */
  const shuffleMix = (array: IMix[]) => {
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
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
  const loadData = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setMixes(appData.mixes);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setMoods(appData.moods);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setAtmospheres(appData.atmospheres);
  };

  /**
   * Go to the next mix in the playlist
   */
  const nextMix = () => {
    if (!currentMood || !mixPlaylist || mixIdx === undefined) return;
    setMixIdx((v) => (v as number) + 1);
  };

  /**
   * Change current mood
   */
  const changeMood = (mood: string) => {
    setCurrentMood(mood);
  };

  /**
   * Change current asmosphere
   */
  const changeAtmosphere = (atmosphere: string) => {
    setCurrentAtmosphere(atmosphere);
  };

  /**
   * Update mix when mixIdx changes
   */
  useEffect(() => {
    if (mixIdx !== undefined && mixPlaylist) setCurrentMix(mixPlaylist[mixIdx]);
  }, [mixIdx, mixPlaylist]);

  /**
   * Update mixPlaylist and mixIdx when mood changes
   */
  useEffect(() => {
    const moodMixes = mixes.filter((mix) => mix.mood === currentMood);
    setMixPlaylist(shuffleMix(moodMixes));
    setMixIdx(0);
  }, [currentMood, mixes]);

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
