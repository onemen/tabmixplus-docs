/**
 * base on https://github.com/rehypejs/rehype-external-links
 * add option to add baseUrl as prefix to local links
 *
 */

/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').ElementContent} ElementContent
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast-util-is-element').Test} Test
 */

/**
 * @callback CreateContent
 *   Create a target for the element.
 * @param {Element} element
 *   Element to check.
 * @returns {Array<ElementContent> | ElementContent | null | undefined}
 *   Content to add.
 *
 * @callback CreateProperties
 *   Create properties for an element.
 * @param {Element} element
 *   Element to check.
 * @returns {Properties | null | undefined}
 *   Properties to add.
 *
 * @callback CreateRel
 *   Create a `rel` for the element.
 * @param {Element} element
 *   Element to check.
 * @returns {Array<string> | string | null | undefined}
 *   `rel` to use.
 *
 * @callback CreateTarget
 *   Create a `target` for the element.
 * @param {Element} element
 *   Element to check.
 * @returns {Target | null | undefined}
 *   `target` to use.
 *
 * @typedef Options
 *   Configuration.
 * @property {Array<ElementContent> | CreateContent | ElementContent | null | undefined} [content]
 *   Content to insert at the end of external links (optional); will be
 *   inserted in a `<span>` element; useful for improving accessibility by
 *   giving users advanced warning when opening a new window.
 * @property {CreateProperties | Properties | null | undefined} [contentProperties]
 *   Properties to add to the `span` wrapping `content` (optional).
 * @property {CreateProperties | Properties | null | undefined} [properties]
 *   Properties to add to the link itself (optional).
 * @property {Array<string> | null | undefined} [protocols=['http', 'https']]
 *   Protocols to check, such as `mailto` or `tel` (default: `['http',
 *   'https']`).
 * @property {Array<string> | CreateRel | string | null | undefined} [rel=['nofollow']]
 *   Link types to hint about the referenced documents (default:
 *   `['nofollow']`); pass an empty array (`[]`) to not set `rel`s on links;
 *   when using a `target`, add `noopener` and `noreferrer` to avoid
 *   exploitation of the `window.opener` API.
 * @property {CreateTarget | Target | null | undefined} [target]
 *   How to display referenced documents; the default (nothing) is to not set
 *   `target`s on links.
 * @property {Test | null | undefined} [test]
 *   Extra test to define which external link elements are modified (optional);
 *   any test that can be given to `hast-util-is-element` is supported.
 *
 * @property {string} [baseUrl]
 *  baseUrl to add as prefix to local links
 *
 * @typedef {'_blank' | '_parent' | '_self' | '_top'} Target
 *   Target.
 */

import { convertElement } from 'hast-util-is-element';
import { visit } from 'unist-util-visit';
import isAbsoluteUrl from './isAbsoluteUrl.mjs';
import parse from './parse.mjs';

const defaultProtocols = ['http', 'https'];
const defaultRel = ['nofollow'];

/** @type {Options} */
const emptyOptions = {};

/**
 * Automatically add `rel` (and `target`?) to external links.
 *
 * ###### Notes
 *
 * You should [likely not configure `target`][css-tricks].
 *
 * You should at least set `rel` to `['nofollow']`.
 * When using a `target`, add `noopener` and `noreferrer` to avoid exploitation
 * of the `window.opener` API.
 *
 * When using a `target`, you should set `content` to adhere to accessibility
 * guidelines by giving users advanced warning when opening a new window.
 *
 * [css-tricks]: https://css-tricks.com/use-target_blank/
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export function rehypeExternalLinks(options) {
  const settings = options || emptyOptions;
  const protocols = settings.protocols || defaultProtocols;
  const is = convertElement(settings.test);

  const baseUrl = settings.baseUrl?.replace(/\/$/, '') ?? '';

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node, index, parent) {
      if (
        node.tagName === 'a' &&
        typeof node.properties.href === 'string' &&
        is(node, index, parent)
      ) {
        const url = node.properties.href;

        if (
          isAbsoluteUrl(url, { httpOnly: false })
            ? protocols.includes(url.slice(0, url.indexOf(':')))
            : url.startsWith('//')
        ) {
          const contentRaw = createIfNeeded(settings.content, node);
          const content = contentRaw && !Array.isArray(contentRaw) ? [contentRaw] : contentRaw;
          const relRaw = createIfNeeded(settings.rel, node) || defaultRel;
          const rel = typeof relRaw === 'string' ? parse(relRaw) : relRaw;
          const target = createIfNeeded(settings.target, node);

          const properties = createIfNeeded(settings.properties, node);

          if (properties) {
            Object.assign(node.properties, structuredClone(properties));
          }

          if (rel.length > 0) {
            node.properties.rel = [...rel];
          }

          if (target) {
            node.properties.target = target;
          }

          if (content) {
            const properties = createIfNeeded(settings.contentProperties, node) || {};

            node.children.push({
              type: 'element',
              tagName: 'span',
              properties: structuredClone(properties),
              children: structuredClone(content),
            });
          }
        } else if (!url.startsWith('#')) {
          const prefix = url.startsWith('/') ? '' : '/';
          node.properties.href = baseUrl + prefix + url;
        }
      }
    });
  };
}

/**
 * Call a function to get a return value or use the value.
 *
 * @template T
 *   Type of value.
 * @param {T} value
 *   Value.
 * @param {Element} element
 *   Element.
 * @returns {T extends Function ? ReturnType<T> : T}
 *   Result.
 */
function createIfNeeded(value, element) {
  return typeof value === 'function' ? value(element) : value;
}
