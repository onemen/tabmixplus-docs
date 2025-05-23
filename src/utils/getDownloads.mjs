const BITBUCKET_URL =
  'https://api.bitbucket.org/2.0/repositories/onemen/tabmixplus-for-firefox/downloads';
const BITBUCKET_QUERY = '?fields=values.name,values.created_on,values.links.self,next';

const headers = new Headers({
  Authorization: `Bearer ${process.env.BITBUCKET_GET_DOWNLOADS_ACCESS_TOKEN}`,
});

async function getAllPages(url) {
  const results = [];
  while (url) {
    const response = await fetch(url, { method: 'GET', headers });
    if (response.ok) {
      const data = await response.json();
      results.push(...data.values);
      url = data.next;
    } else {
      const { status, statusText } = response;
      throw new Error(`status: ${status}, statusText: ${statusText}`);
    }
  }
  return results;
}

/**
 * @typedef {Object} Download
 * @property {string} name - The name of the download.
 * @property {string} created_on - The creation date of the download.
 * @property {{self: {href: string}}} links - The links related to the download.
 */

export async function getDownloadsInfo() {
  try {
    const downloadsInfo = await getAllPages(`${BITBUCKET_URL}${BITBUCKET_QUERY}`);
    const releases = new Map();
    const devBuilds = [];
    let latestDate = 0;

    for (const download of downloadsInfo) {
      /** @type {Download} */
      const {
        name,
        created_on: createdAt,
        links: {
          self: { href },
        },
      } = download;

      const version = name.replace(/test-build-|dev-build-|tab_mix_plus-|.xpi/g, '');
      const timestamp = Date.parse(createdAt);
      const linkInfo = { name, timestamp, href, version };

      if (name.includes('test-build') || name.includes('dev-build')) {
        devBuilds.push(linkInfo);
      } else {
        latestDate = timestamp > latestDate ? timestamp : latestDate;
        // get proper version from bitbucket file name in the format:
        // 'tab_mix_plus-1.26.0a.xpi'
        linkInfo.version = version.replace(/[a-zA-Z]$/, '');
        const savedData = releases.get(linkInfo.version);
        if (!savedData || savedData.timestamp < timestamp) {
          releases.set(linkInfo.version, linkInfo);
        }
      }
    }

    // filter out old devBuild
    const [devBuild] = devBuilds.filter(b => b.timestamp > latestDate);
    if (devBuild) {
      releases.set('dev-build', devBuild);
    }
    return Object.fromEntries(releases);
  } catch (error) {
    console.log('Error fetching downloads links from bitbucket', error);
  }
}
