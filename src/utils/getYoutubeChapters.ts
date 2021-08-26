import { IYoutubeChapter } from '../typings/youtubeChapters.types';

const specialChars = ' <>@!#$%^&*()_+[]{}?:;|\'"\\,./~`-=';

const makeChapterParser = (
  startRx: RegExp,
  lineRx: RegExp,
  timestampIndex: number,
  textIndex: number,
) => {
  // The first match element is the input, which will never be either the full timestamp or full title
  timestampIndex += 1;
  textIndex += 1;

  return (description: string) => {
    const chapters: IYoutubeChapter[] = [];

    const firstTimestamp = description.search(startRx);
    if (firstTimestamp === -1) {
      return chapters;
    }

    const chapterLines = description.slice(firstTimestamp).split('\n');
    for (let i = 0; i < chapterLines.length; i += 1) {
      const line = chapterLines[i];

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

      chapters.push({
        start: hours * 60 * 60 + minutes * 60 + seconds,
        title: title.trim(),
      });
    }

    return chapters;
  };
};

const addM = (regex: RegExp) => {
  if (regex.flags.indexOf('m') === -1) {
    return new RegExp(regex.source, `${regex.flags}m`);
  }
  return regex;
};

// $timestamp $title
const lawfulParser = makeChapterParser(
  /^0:00/m,
  /^(?:(\d+):)?(\d+):(\d+)\s+(.*?)$/,
  0,
  3,
);
// ($track_id. )$title $timestamp
const postfixRx = /^(?:\d+\.\s+)?(.*)\s+(?:(\d+):)?(\d+):(\d+)$/;
const postfixParser = makeChapterParser(addM(postfixRx), postfixRx, 1, 0);
// ($track_id. )$title ($timestamp)
const postfixParenRx = /^(?:\d+\.\s+)?(.*)\s+\(\s*(?:(\d+):)?(\d+):(\d+)\s*\)$/;
const postfixParenParser = makeChapterParser(
  addM(postfixParenRx),
  postfixParenRx,
  1,
  0,
);
// $track_id. $timestamp $title
const prefixRx = /^\d+\.\s+(?:(\d+):)?(\d+):(\d+)\s+(.*)$/;
const prefixParser = makeChapterParser(addM(prefixRx), prefixRx, 0, 3);

const getYoutubeChapters = (
  description: string,
  extended?: boolean,
): IYoutubeChapter[] => {
  let chapters = lawfulParser(description);
  if (chapters.length === 0) chapters = postfixParser(description);
  if (chapters.length === 0) chapters = postfixParenParser(description);
  // YouTube doesn't support prefix parsing
  if (chapters.length === 0 && extended) chapters = prefixParser(description);

  return chapters;
};

const getNextChapter = (
  chapters: IYoutubeChapter[],
  currentTimestamp: number,
): IYoutubeChapter | undefined =>
  chapters.find((chapter) => chapter.start > currentTimestamp);

export { getYoutubeChapters, getNextChapter };
