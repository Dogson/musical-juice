import { ITrack } from '../typings/Tracks.types';

export interface IUseTracksManager {
  track?: ITrack;
  nextTrack: () => ITrack | null;
  previousTrackTitle: string;
  checkTrackWithTimestamp: (timestamp: number) => void;
}
