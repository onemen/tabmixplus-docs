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
  const { assets, name, body, created_at: createdAt, tag_name } = data;
  const { browser_download_url: downloadLink, updated_at } = assets.find(asset =>
    asset.name.startsWith('tab_mix_plus-')
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
  if (tag_name === 'dev-build') {
    title = 'Development Build';
    badge = `
  badge:
    text: Development
    variant: tip`;
  }

  const note = `
:::note[no-title]
  All releases are available in the Releases/Change Log menu and at our GitHub repository <a href="https://github.com/onemen/TabMixPlus/releases/">releases</a>
:::\n\n$&`;

  return `---
title: "${title}"
editUrl: false
lastUpdated: ${createdAt}
sidebar:
  order: ${-Date.parse(updated_at)}${badge}
---
<div hidden data-release></div>

${(isLatest ? body.replace('##', note) : body).replace(/(###)\s*(:.*:)?\s*(.*)/g, replaceEmoji)}

### Download
<a href="${bitbucketHref ?? downloadLink}" target="_top" role="link">${name}</a>${isLatest ? '\n\n[no-title]: #' : ''}`;
}

// Function to get release dates from the TabMixPlus repository
async function getReleaseDates(octokit) {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'config/release_dates.json',
    });

    // Content is base64 encoded, so we need to decode it
    const content = Buffer.from(data.content, 'base64').toString();
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Warning: Could not load release dates: ${error.message}`);
    return { releases: {} };
  }
}

async function buildReleases() {
  const octokit = new Octokit();
  await fsPromises.mkdir(releasesPath, { recursive: true });

  const [{ data: releases }, { releases: releaseDates }, bitbucketDownloads] = await Promise.all([
    octokit.repos.listReleases({
      owner,
      repo,
    }),
    getReleaseDates(octokit),
    getDownloadsInfo(),
  ]);

  const sortedReleases = releases.sort(
    (a, b) => Date.parse(b.published_at) - Date.parse(a.published_at)
  );

  const latestRelease = sortedReleases.find(release => release.tag_name !== 'dev-build');

  if (sortedReleases[0].body.includes('No changes since')) {
    sortedReleases.shift();
  }

  const downloadsInfo = {
    devBuild: [],
    releases: [],
  };

  for (const release of sortedReleases) {
    // don't use tag_name here, in the past some version changed without
    // changing the tag_name
    const version = release.name
      .replace('Development Build', 'dev-build')
      .replace(/^v/, '')
      .split(':')[0];

    const bitbucketInfo = bitbucketDownloads[version];
    if (!bitbucketInfo) {
      throw new Error(`Can't find ${version} in bitbucket downloads`);
    }

    // we are using github dates instead of bitbucket dates
    const timestamp = Date.parse(release.created_at);
    const info = {
      ...bitbucketInfo,
      createdAt: release.created_at,
      timestamp,
      date: new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(timestamp)),
    };

    // Add ESR and Firefox version data if available
    const versionData = releaseDates[version];
    if (versionData) {
      info.esr_version = versionData.esr_version;
      info.firefox_version = versionData.firefox_version;
    }

    const channel = version === 'dev-build' ? 'devBuild' : 'releases';
    downloadsInfo[channel].push(info);

    // generate release markdown
    const isLatest = release === latestRelease;
    const content = releaseTemplate(release, info.href, isLatest);
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
