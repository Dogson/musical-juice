import { IYoutubeSong } from '../typings/youtubeSongs.types';

const specialChars = ' <>@!#$%^&*()_+[]{}?:;|\'"\\,./~`-=';

const makeSongParser = (
  startRx: RegExp,
  lineRx: RegExp,
  timestampIndex: number,
  textIndex: number,
) => {
  // The first match element is the input, which will never be either the full timestamp or full title
  timestampIndex += 1;
  textIndex += 1;

  return (description: string) => {
    const songs: IYoutubeSong[] = [];

    const firstTimestamp = description.search(startRx);
    if (firstTimestamp === -1) {
      return songs;
    }

    const songLines = description.slice(firstTimestamp).split('\n');
    for (let i = 0; i < songLines.length; i += 1) {
      const line = songLines[i];

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

      songs.push({
        start: hours * 60 * 60 + minutes * 60 + seconds,
        title: title.trim(),
      });
    }

    return songs;
  };
};

const addM = (regex: RegExp) => {
  if (regex.flags.indexOf('m') === -1) {
    return new RegExp(regex.source, `${regex.flags}m`);
  }
  return regex;
};

// $timestamp $title
const lawfulParser = makeSongParser(
  /^0:00/m,
  /^(?:(\d+):)?(\d+):(\d+)\s+(.*?)$/,
  0,
  3,
);
// ($track_id. )$title $timestamp
const postfixRx = /^(?:\d+\.\s+)?(.*)\s+(?:(\d+):)?(\d+):(\d+)$/;
const postfixParser = makeSongParser(addM(postfixRx), postfixRx, 1, 0);
// ($track_id. )$title ($timestamp)
const postfixParenRx = /^(?:\d+\.\s+)?(.*)\s+\(\s*(?:(\d+):)?(\d+):(\d+)\s*\)$/;
const postfixParenParser = makeSongParser(
  addM(postfixParenRx),
  postfixParenRx,
  1,
  0,
);
// $track_id. $timestamp $title
const prefixRx = /^\d+\.\s+(?:(\d+):)?(\d+):(\d+)\s+(.*)$/;
const prefixParser = makeSongParser(addM(prefixRx), prefixRx, 0, 3);

const getYoutubeSongs = (
  description: string,
  extended?: boolean,
): IYoutubeSong[] => {
  let songs = lawfulParser(description);
  if (songs.length === 0) songs = postfixParser(description);
  if (songs.length === 0) songs = postfixParenParser(description);
  // YouTube doesn't support prefix parsing
  if (songs.length === 0 && extended) songs = prefixParser(description);

  return songs;
};

const getNextSong = (
  songs: IYoutubeSong[],
  currentTimestamp: number,
): IYoutubeSong | undefined =>
  songs.find((song) => song.start > currentTimestamp);

const getNextSongIdx = (
  songs: IYoutubeSong[],
  currentTimestamp: number,
): number => songs.findIndex((song) => song.start > currentTimestamp);

const getCurrentSong = (
  songs: IYoutubeSong[],
  currentTimeStamp: number,
): IYoutubeSong => {
  const nextSongIdx = getNextSongIdx(songs, currentTimeStamp);
  if (nextSongIdx === -1) return songs[songs.length - 1];
  return songs[nextSongIdx - 1];
};

export { getYoutubeSongs, getNextSong, getCurrentSong };
