import { ITrack } from '../typings/Tracks.types';

export interface IUseTracksManager {
  track?: ITrack;
  nextTrack: () => ITrack | null;
  checkTrackWithTimestamp: (timestamp: number) => void;
}
