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

/**
 * Fetches the latest Firefox version from Mozilla's product details API
 * @returns {Promise<number>} The latest Firefox version as a number, or 0 if fetch fails
 */
export async function getLatestFirefoxVersion() {
  const firefoxVersionsURL = 'https://product-details.mozilla.org/1.0/firefox_versions.json';
  try {
    const response = await fetch(firefoxVersionsURL);
    const data = await response.json();
    return parseInt(data.LATEST_FIREFOX_VERSION ?? '0');
  } catch (error) {
    console.error('Failed to fetch Firefox version:', error);
    return 0;
  }
}
