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
  const eWindow: IWindow | undefined =
    typeof window !== `undefined` ? (window as unknown as IWindow) : undefined;
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
    (putInLast?: IMix, forceMood?: string) => {
      const mood = forceMood || currentMood;
      let moodMixes: IMix[];
      if (mood === 'favs') {
        moodMixes = mixes.filter((mix) => mix.fav);
      } else {
        moodMixes = mixes.filter((mix) => mix.mood === mood);
      }
      let elemIndex;

      // let randomPlaylist = moodMixes.reverse();

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

  const getMixes = useCallback((mixData: IMix[], mood: string) => {
    const favsIds = JSON.parse(localStorage.getItem('favIds') || '[]');
    return mixData.map((mix: IMix) => ({
      ...mix,
      mood,
      tracks: parseYoutubeDescription(mix.description, false),
      url: `https://youtube.com/v/${mix.id}`,
      fav: favsIds.includes(mix.id),
    }));
  }, []);

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

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${mix.id}?enablejsapi=1`;
      iframe.id = mix.id;
      document.body.appendChild(iframe);
      document.body.style.overflow = 'visible';
    }

    if (eWindow)
      eWindow.checkWhichMixesAreDown = () => {
        console.log('CHECKING IF SOME MIXES ARE DOWN');
        console.log(`'TOTAL MIXES : ${mixes.length}`);
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
   * Load app data (mixes, favs, atmospheres and moods) with gatsby GraphQL queries
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
      if (mood !== currentMood) {
        randomizePlaylist(undefined, mood);
      }
    },
    [currentMood, randomizePlaylist, setCurrentMood],
  );

  /**
   * Change current atmosphere
   */
  const changeAtmosphere = useCallback(
    (atmosphere?: string) => {
      setCurrentAtmosphere(atmosphere);
    },
    [setCurrentAtmosphere],
  );

  /**
   * Add or remove current mix to/from favs
   */
  const addOrRemoveCurrentMixToFavs = useCallback(() => {
    if (!currentMix) return;
    let favsIds = JSON.parse(localStorage.getItem('favIds') || '[]');
    if (favsIds.includes(currentMix.id)) {
      // remove fav
      favsIds = favsIds.filter((id: string) => currentMix.id !== id);
    } else {
      // add fav
      favsIds.push(currentMix.id);
    }
    const newMixes = mixes.map((mix) => {
      const fav = favsIds.includes(mix.id);
      return { ...mix, fav };
    });
    setMixes(newMixes);

    localStorage.setItem('favIds', JSON.stringify(favsIds));
  }, [currentMix, mixes, setMixes]);

  /**
   * Update mix when mixIdx changes
   */
  useEffect(() => {
    if (mixIdx !== undefined && mixPlaylist) {
      setCurrentMix(mixPlaylist[mixIdx]);
    }
  }, [mixIdx, mixPlaylist, setCurrentMix]);

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
    addOrRemoveCurrentMixToFavs,
  };
};

export default useAppContextManager;
