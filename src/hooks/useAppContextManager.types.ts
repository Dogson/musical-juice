import { IMix } from '../typings/Mixes.types';

export interface IUseAppContextManager {
  loadData: () => void;
  moods: string[];
  currentMood?: string;
  atmospheres: string[];
  currentAtmosphere?: string;
  mixes: IMix[];
  currentMix?: IMix;
  changeMood: (mood: string) => void;
  nextMix: () => void;
  changeAtmosphere: (atmosphere: string) => void;
}
