import { IMix } from '../typings/Mixes.types';

export interface IAppContext {
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
