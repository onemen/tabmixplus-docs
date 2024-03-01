const BITBUCKET_URL =
  'https://api.bitbucket.org/2.0/repositories/onemen/tabmixplus-for-firefox/downloads';

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
    const downloadsInfo = await getAllPages(BITBUCKET_URL);
    const downloads = {
      devBuild: [],
      releases: [],
    };
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
      const date = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(timestamp));

      const linkInfo = { name, createdAt, timestamp, date, href, version };

      if (name.includes('test-build') || name.includes('dev-build')) {
        downloads.devBuild.push(linkInfo);
      } else {
        latestDate = timestamp > latestDate ? timestamp : latestDate;
        downloads.releases.push(linkInfo);
      }
    }

    // filter out old devBuild
    downloads.devBuild = downloads.devBuild.filter(b => b.timestamp > latestDate);

    return downloads;
  } catch (error) {
    console.log('Error fetching downloads links from bitbucket', error);
  }
}
