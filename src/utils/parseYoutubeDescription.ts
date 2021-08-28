import { ITrack } from '../typings/Tracks.types';

const specialChars = ' <>@!#$%^&*()_+[]{}?:;|\'"\\,./~`—-=';

const makeTrackParser = (
  startRx: RegExp,
  lineRx: RegExp,
  timestampIndex: number,
  textIndex: number,
) => {
  // The first match element is the input, which will never be either the full timestamp or full title
  timestampIndex += 1;
  textIndex += 1;

  return (description: string) => {
    const tracks: ITrack[] = [];

    const firstTimestamp = description.search(startRx);
    if (firstTimestamp === -1) {
      return tracks;
    }

    const trackLines = description.slice(firstTimestamp).split('\n');
    for (let i = 0; i < trackLines.length; i += 1) {
      const line = trackLines[i];

      const match = lineRx.exec(line);
      if (!match) {
        break;
      }

      const hours =
        match[timestampIndex] !== undefined
          ? parseInt(match[timestampIndex], 10)
          : 0;
      const minutes = parseInt(match[timestampIndex + 1], 10);
      const seconds = parseInt(match[timestampIndex + 2], 10);

      let title = match[textIndex].trim();
      let substrIdx = 0;
      title.split('').some((el) => {
        if (specialChars.indexOf(el) === -1) {
          return true;
        }
        substrIdx += 1;
        return false;
      });
      title = title.substr(substrIdx);

      const splitted = title.split('');
      // eslint-disable-next-line for-direction
      for (let j = splitted.length - 1; j >= 0; j -= 1) {
        substrIdx = j + 1;
        if (specialChars.indexOf(splitted[j]) === -1) {
          break;
        }
      }
      title = title.substr(0, substrIdx);

      tracks.push({
        start: hours * 60 * 60 + minutes * 60 + seconds,
        title: title.trim(),
      });
    }

    return tracks;
  };
};

const addM = (regex: RegExp) => {
  if (regex.flags.indexOf('m') === -1) {
    return new RegExp(regex.source, `${regex.flags}m`);
  }
  return regex;
};

// $timestamp $title
const lawfulParser = makeTrackParser(
  /^0:00/m,
  /^(?:(\d+):)?(\d+):(\d+)\s+(.*?)$/,
  0,
  3,
);
// ($track_id. )$title $timestamp
const postfixRx = /^(?:\d+\.\s+)?(.*)\s+(?:(\d+):)?(\d+):(\d+)$/;
const postfixParser = makeTrackParser(addM(postfixRx), postfixRx, 1, 0);
// ($track_id. )$title ($timestamp)
const postfixParenRx = /^(?:\d+\.\s+)?(.*)\s+\(\s*(?:(\d+):)?(\d+):(\d+)\s*\)$/;
const postfixParenParser = makeTrackParser(
  addM(postfixParenRx),
  postfixParenRx,
  1,
  0,
);
// $track_id. $timestamp $title
const prefixRx = /^\d+\.\s+(?:(\d+):)?(\d+):(\d+)\s+(.*)$/;
const prefixParser = makeTrackParser(addM(prefixRx), prefixRx, 0, 3);

const parseYoutubeDescription = (
  description: string,
  extended?: boolean,
): ITrack[] => {
  let tracks = lawfulParser(description);
  if (tracks.length === 0) tracks = postfixParser(description);
  if (tracks.length === 0) tracks = postfixParenParser(description);
  // YouTube doesn't support prefix parsing
  if (tracks.length === 0 && extended) tracks = prefixParser(description);

  return tracks;
};

export default parseYoutubeDescription;
