import { ITrack } from '../typings/Tracks.types';

export interface IUseTracksManager {
  track?: ITrack;
  nextTrack: () => ITrack | null;
  previousTrack: () => ITrack | null;
  previousTrackTitle: string;
  nextTrackTitle: string;
  checkTrackWithTimestamp: (timestamp: number) => void;
  totalTracks: number;
}
