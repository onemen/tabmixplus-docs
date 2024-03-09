import { Octokit } from '@octokit/rest';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { getDownloadsInfo } from './getDownloads.mjs';

const owner = 'onemen';
const repo = 'TabMixPlus';

const relativeReleasesPath = 'src/content/docs/releases';
const releasesPath = path.join(process.cwd(), relativeReleasesPath);

const relativeDownloadsInfo = 'src/utils/downloadsInfo.json';
const downloadsInfoPath = path.join(process.cwd(), relativeDownloadsInfo);

const emojiMap = {
  ':sparkles:': '✨',
  ':bug:': '🐛',
  ':zap:': '⚡',
  ':recycle:': '♻️',
  ':white_check_mark:': '✅',
  ':construction_worker:': '👷',
  ':memo:': '📝',
  ':art:': '🎨',
  ':wrench:': '🔧',
  ':flying_saucer:': '🛸',
  Features: '✨ New Features',
  'Bug Fixes': '🐛 Bug Fixes',
  Maintenance: '🔧 Maintenance',
  Documentation: '📝 Documentation Changes',
  Style: '🎨 Code Style Changes',
  Refactor: '♻️ Refactors',
  'Performance Improvements': '⚡ Performance Improvements',
  Test: '✅ Tests',
};

function replaceEmoji(text, prefix, name, title) {
  const emoji = emojiMap[name ?? title];
  if (emoji) {
    return name ? `${prefix} ${emoji} ${title}` : `${prefix} ${emoji}`;
  }
  return text;
}

/** @typedef {import('@octokit/openapi-types').components['schemas']['release']} ReleasesType */

/**
 * @param {ReleasesType} data
 * @returns string
 */
function releaseTemplate(data, bitbucketHref, isLatest) {
  const { assets, tag_name: name, body, published_at: publishedAt } = data;
  const { browser_download_url: downloadLink } = assets.find(
    asset => asset.name === 'tab_mix_plus-dev-build.xpi'
  );

  let title = name;
  let badge = '';
  // indent are important here !
  if (isLatest) {
    badge = `
  badge:
    text: Latest
    variant: success`;
  }
  if (name === 'dev-build') {
    title = 'Development Build';
    badge = `
  badge:
    text: Development
    variant: danger`;
  }

  const note = `
:::note[no-title]
  All releases are available in the Releases/Change Log menu and at our GitHub repository <a href="https://github.com/onemen/TabMixPlus/releases/">releases</a>
:::\n\n$&`;

  return `---
title: "${title}"
lastUpdated: ${publishedAt}
sidebar:
  order: ${-Date.parse(publishedAt)}${badge}
---

${(isLatest ? body.replace('##', note) : body).replace(/(###)\s*(:.*:)?\s*(.*)/g, replaceEmoji)}

### Download
<a href="${bitbucketHref ?? downloadLink}" target="_top" role="link">${name}</a>${isLatest ? '\n\n[no-title]: #' : ''}`;
}

async function buildReleases() {
  const octokit = new Octokit();
  await fsPromises.mkdir(releasesPath, { recursive: true });

  const [{ data: releases }, downloadsInfo] = await Promise.all([
    octokit.repos.listReleases({
      owner,
      repo,
    }),
    getDownloadsInfo(),
  ]);

  const sortedReleases = releases.sort(
    (a, b) => Date.parse(b.published_at) - Date.parse(a.published_at)
  );

  const latestRelease = sortedReleases.find(release => release.tag_name !== 'dev-build');

  if (sortedReleases[0].body.includes('No changes since')) {
    sortedReleases.shift();
  }

  for (const release of sortedReleases) {
    // overrid bitbucket dates with dates from github
    const version = release.tag_name.replace(/^v/, '');
    const info = downloadsInfo[version === 'dev-build' ? 'devBuild' : 'releases'].find(
      info => info.version === version
    );
    if (info) {
      info.createdAt = release.published_at;
      info.timestamp = Date.parse(release.published_at);
      info.date = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(info.timestamp));
    }

    // generate release markdown
    const isLatest = release === latestRelease;
    const content = releaseTemplate(release, info?.href, isLatest);
    const filename = isLatest ? 'latest' : release.tag_name.replace(/\s+/g, '-');
    const filePath = path.join(releasesPath, `${filename}.md`);
    await fsPromises.writeFile(filePath, content);
  }

  await fsPromises.writeFile(downloadsInfoPath, JSON.stringify(downloadsInfo, null, 2));
  console.log(
    `Releases markdown files were generated. ${releases.length} files were saved to ${relativeReleasesPath}.`
  );
}

try {
  buildReleases();
} catch (error) {
  console.error(error);
}
