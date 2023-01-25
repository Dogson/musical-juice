/* eslint-disable no-console */
import { useCallback, useContext, useEffect } from 'react';

import atmospheresData from '../../static/data/atmospheres.json';
import chillMixesData from '../../static/data/chill-mixes.json';
import groovyMixesData from '../../static/data/groovy-mixes.json';
import lofiMixesData from '../../static/data/lofi-mixes.json';
import moodsData from '../../static/data/moods.json';
import AppContext from '../context/app-context/AppContext';
import { IMix } from '../typings/Mixes.types';
import { IWindow } from '../typings/Window.types';
import parseYoutubeDescription from '../utils/parseYoutubeDescription';
import { IUseAppContextManager } from './useAppContextManager.types';

const useAppContextManager = (): IUseAppContextManager => {
  const eWindow: IWindow = window as unknown as IWindow;
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

  const getMixes = useCallback(
    (mixData: IMix[], mood: string) =>
      mixData.map((mix: IMix) => ({
        ...mix,
        mood,
        tracks: parseYoutubeDescription(mix.description, false),
        url: `https://youtube.com/v/${mix.id}`,
      })),
    [],
  );

  const setDownMixesCheckFunction = useCallback(() => {
    function checkThumbnail(width: number, mix: IMix) {
      // HACK a mq thumbnail has width of 320.
      // if the video does not exist(therefore thumbnail don't exist), a default thumbnail of 120 width is returned.
      if (width === 120) {
        console.warn(
          `This ${mix.mood.toUpperCase()} mix does not exist anymore.`,
        );
        console.warn(`ID : ${mix.id}`);
        console.warn(`URL : https://www.youtube.com/watch?v=${mix.id}`);
      }
    }

    function validVideoId(mix: IMix) {
      const img = new Image();
      img.src = `http://img.youtube.com/vi/${mix.id}/mqdefault.jpg`;
      img.onload = () => {
        checkThumbnail(img.width, mix);
      };
      img.onerror = () => {
        console.warn(
          `This ${mix.mood.toUpperCase()} mix does not exist anymore.`,
        );
        console.warn(`ID : ${mix.id}`);
        console.warn(`URL : https://www.youtube.com/watch?v=${mix.id}`);
      };
    }

    eWindow.checkWhichMixesAreDown = () => {
      console.log('CHECKING IF SOME MIXES ARE DOWN');
      if (!mixes) {
        console.warn('Wait for app to initialize and try again.');
      } else {
        mixes.forEach((mix) => {
          validVideoId(mix);
          const tracks = parseYoutubeDescription(mix.description, false);
          if (!tracks || tracks.length < 3) {
            console.warn("Can't generate tracks for this mix :");
            console.warn(`ID : ${mix.id}`);
            console.warn(`URL : https://www.youtube.com/watch?v=${mix.id}`);
          }
        });

        const mixesId = mixes.map((mix) => mix.id);
        mixesId.some((id) => {
          if (mixesId.indexOf(id) !== mixesId.lastIndexOf(id)) {
            console.warn(`There is a duplicate video id : ${id}`);
          }
          return false;
        });
      }
    };
  }, [eWindow, mixes]);

  /**
   * Load app data (mixes, atmospheres and moods) with gatsby GraphQL queries
   */
  const loadData = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setMixes([
      ...getMixes(chillMixesData as unknown as IMix[], 'chill'),
      ...getMixes(groovyMixesData as unknown as IMix[], 'groovy'),
      ...getMixes(lofiMixesData as unknown as IMix[], 'lofi'),
    ]);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setMoods(moodsData);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setAtmospheres(atmospheresData);
  }, [getMixes, setAtmospheres, setMixes, setMoods]);

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

  /**
   * Setting global youtube URL up function
   */
  useEffect(() => {
    setDownMixesCheckFunction();
  }, [setDownMixesCheckFunction]);

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
