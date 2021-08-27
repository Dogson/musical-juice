import { IMix } from '../typings/Mixes.types';

export interface IAppContext {
  moods: string[];
  currentMood?: string;
  setMoods: (moods: string[]) => void;
  setCurrentMood: (mood: string) => void;
  atmospheres: string[];
  currentAtmosphere?: string;
  setAtmospheres: (atmospheres: string[]) => void;
  setCurrentAtmosphere: (atmosphere: string) => void;
  mixes: IMix[];
  currentMix?: IMix;
  setMixes: (mixes: IMix[]) => void;
  setCurrentMix: (mix: IMix) => void;
  mixPlaylist: IMix[];
  setMixPlaylist: (mixes: IMix[]) => void;
  mixIdx?: number;
  setMixIdx: (idx: number) => void;
}
