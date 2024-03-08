import fs from 'node:fs';

const generatedFilePath = 'src/utils/downloadsInfo.json';

export const isDownloadsInfoExist = () => fs.existsSync(generatedFilePath);

export const downloadLink = () =>
  isDownloadsInfoExist()
    ? '/tabmixplus-docs/download'
    : 'https://bitbucket.org/onemen/tabmixplus-for-firefox/downloads/';

export const releasesLink = () =>
  isDownloadsInfoExist()
    ? '/tabmixplus-docs/releases/latest'
    : 'https://github.com/onemen/TabMixPlus/releases';
