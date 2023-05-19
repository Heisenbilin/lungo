/**
 * Split a string on markdown links (e.g. [some link](https://...)) into
 * segments of plain text that weren't part of a link (marked as
 * `isLink === false`), and segments with text content and a URL that did make
 * up a link (marked as `isLink === true`).
 * @param {string} text
 * @return {Array<{isLink: true, text: string, linkHref: string}|{isLink: false, text: string}>}
 */
export function splitMarkdownLink(text) {
  /** @type {Array<{isLink: true, text: string, linkHref: string}|{isLink: false, text: string}>} */
  const segments:any = [];

  const parts = text.split(/\[([^\]]+?)\]\((https?:\/\/.*?)\)/g);
  while (parts.length) {
    // Shift off the same number of elements as the pre-split and capture groups.
    const [preambleText, linkText, linkHref] = parts.splice(0, 3);

    if (preambleText) {
      // Skip empty text as it's an artifact of splitting, not meaningful.
      segments.push({
        isLink: false,
        text: preambleText,
      });
    }

    // Append link if there are any.
    if (linkText && linkHref) {
      segments.push({
        isLink: true,
        text: linkText,
        linkHref,
      });
    }
  }

  return segments;
}

const SCREENSHOT_PREFIX = 'data:image/jpeg;base64,';

/**
 * 主要功能：把audits里面的内容放到categories中每个auditRef的result里面
 * Returns a new LHR that's reshaped for slightly better ergonomics within the report rendereer.
 * Also, sets up the localized UI strings used within renderer and makes changes to old LHRs to be
 * compatible with current renderer.
 * The LHR passed in is not mutated.
 * TODO(team): we all agree the LHR shape change is technical debt we should fix
 * @param {LH.Result} result
 * @return {LH.ReportResult}
 */
export function prepareReportResult(result) {
  // If any mutations happen to the report within the renderers, we want the original object untouched
  const clone = /** @type {LH.ReportResult} */ (JSON.parse(JSON.stringify(result)));


  // If LHR is older (≤3.0.3), it has no locale setting. Set default.
  if (!clone.configSettings.locale) {
    clone.configSettings.locale = 'en';
  }
  if (!clone.configSettings.formFactor) {
    clone.configSettings.formFactor = clone.configSettings.emulatedFormFactor;
  }

  for (const audit of Object.values(clone.audits) as any) {
    // Turn 'not-applicable' (LHR <4.0) and 'not_applicable' (older proto versions)
    // into 'notApplicable' (LHR ≥4.0).
    // eslint-disable-next-line max-len
    if (
      audit.scoreDisplayMode === 'not_applicable' ||
      audit.scoreDisplayMode === 'not-applicable'
    ) {
      audit.scoreDisplayMode = 'notApplicable';
    }

    if (audit.details) {
      // Turn `auditDetails.type` of undefined (LHR <4.2) and 'diagnostic' (LHR <5.0)
      // into 'debugdata' (LHR ≥5.0).

      if (audit.details.type === undefined || audit.details.type === 'diagnostic') {
        audit.details.type = 'debugdata';
      }

      // Add the jpg data URL prefix to filmstrip screenshots without them (LHR <5.0).
      if (audit.details.type === 'filmstrip') {
        for (const screenshot of audit.details.items) {
          if (!screenshot.data.startsWith(SCREENSHOT_PREFIX)) {
            screenshot.data = SCREENSHOT_PREFIX + screenshot.data;
          }
        }
      }
    }
  }

  // For convenience, smoosh all AuditResults into their auditRef (which has just weight & group)
  if (typeof clone.categories !== 'object') throw new Error('No categories provided.');
  for (const category of Object.values(clone.categories) as any) {
    category.auditRefs.forEach(auditRef => {
      const result = clone.audits[auditRef.id];
      auditRef.result = result;

      // attach the stackpacks to the auditRef object
      if (clone.stackPacks) {
        clone.stackPacks.forEach(pack => {
          if (pack.descriptions[auditRef.id]) {
            auditRef.stackPacks = auditRef.stackPacks || [];
            auditRef.stackPacks.push({
              title: pack.title,
              iconDataURL: pack.iconDataURL,
              description: pack.descriptions[auditRef.id],
            });
          }
        });
      }
    });
  }
  return clone;
}

export function showAsPassed(audit) {
  switch (audit.scoreDisplayMode) {
    case 'manual':
    case 'notApplicable':
      return true;
    case 'error':
    case 'informative':
      return false;
    case 'numeric':
    case 'binary':
    default:
      return Number(audit.score) >= 0.9;
  }
}

export function getStabilityAudits(category) {
  // Top level clumps for audits, in order they will appear in the report.
  /** @type {Map<TopLevelClumpId, Array<LH.ReportResult.AuditRef>>} */
  const clumps = new Map();
  clumps.set('failed', []);
  clumps.set('warning', []);
  clumps.set('manual', []);
  clumps.set('passed', []);
  clumps.set('notApplicable', []);
  // Sort audits into clumps.
  for (const auditRef of category.auditRefs) {
    const clumpId = _getClumpIdForAuditRef(auditRef);
    const clump = /** @type {Array<LH.ReportResult.AuditRef>} */ (clumps.get(clumpId)); // already defined
    clump.push(auditRef);
    clumps.set(clumpId, clump);
  }

  for (const [clumpId, auditRefs] of clumps) {
    if (auditRefs.length === 0) continue;

    if (clumpId === 'failed') {
      const groupMap = getUnexpandableClump(auditRefs);
      return groupMap;
    }
  }
  return new Map();
}

//把找到的稳定性建议按照id归类
function getUnexpandableClump(auditRefs) {
  // Audits grouped by their group (or under notAGroup).
  /** @type {Map<string, Array<LH.ReportResult.AuditRef>>} */
  const grouped = new Map();

  // Add audits without a group first so they will appear first.
  const notAGroup = 'NotAGroup';
  grouped.set(notAGroup, []);

  for (const auditRef of auditRefs) {
    const groupId = auditRef.group || notAGroup;
    const groupAuditRefs = grouped.get(groupId) || [];
    groupAuditRefs.push(auditRef);
    grouped.set(groupId, groupAuditRefs);
  }

  return grouped;
}

function _getClumpIdForAuditRef(auditRef) {
  const scoreDisplayMode = auditRef.result.scoreDisplayMode;
  if (scoreDisplayMode === 'manual' || scoreDisplayMode === 'notApplicable') {
    return scoreDisplayMode;
  }

  if (showAsPassed(auditRef.result)) {
    if (_auditHasWarning(auditRef)) {
      return 'warning';
    } else {
      return 'passed';
    }
  } else {
    return 'failed';
  }
}

function _auditHasWarning(audit) {
  return Boolean(audit.result.warnings && audit.result.warnings.length);
}

/**
 * Get an audit's wastedMs to sort the opportunity by, and scale the sparkline width
 * Opportunities with an error won't have a details object, so MIN_VALUE is returned to keep any
 * erroring opportunities last in sort order.
 * @param {LH.ReportResult.AuditRef} audit
 * @return {number}
 */
export function _getWastedMs(audit) {
  if (audit.result.details && audit.result.details.type === 'opportunity') {
    const details = audit.result.details;
    if (typeof details.overallSavingsMs !== 'number') {
      throw new Error('non-opportunity details passed to _getWastedMs');
    }
    return details.overallSavingsMs;
  } else {
    return Number.MIN_VALUE;
  }
}

export function caculateScale(audits) {
  const minimumScale = 2000;
  const wastedMsValues = audits.map(audit => _getWastedMs(audit));
  const maxWaste = Math.max(...wastedMsValues);
  const scale = Math.max(Math.ceil(maxWaste / 1000) * 1000, minimumScale);
  return scale;
}

const ELLIPSIS = '\u2026';
/**
 * @param {URL} parsedUrl
 * @param {{numPathParts?: number, preserveQuery?: boolean, preserveHost?: boolean}=} options
 * @return {string}
 */
function getURLDisplayName(parsedUrl, options={
  numPathParts: undefined,
  preserveQuery: undefined,
  preserveHost: undefined,
}) {
  // 闭包可选属性在 tsc 中不是可选的，因此回退需要未定义的值。

  const numPathParts = options.numPathParts !== undefined ? options.numPathParts : 2;
  const preserveQuery = options.preserveQuery !== undefined ? options.preserveQuery : true;
  const preserveHost = options.preserveHost || false;

  let name;

  if (parsedUrl.protocol === 'about:' || parsedUrl.protocol === 'data:') {
    // 处理 'about:*' 和 'data:*' URL，因为它们没有路径。
    name = parsedUrl.href;
  } else {
    name = parsedUrl.pathname;
    const parts = name.split('/').filter(part => part.length);
    if (numPathParts && parts.length > numPathParts) {
      name = ELLIPSIS + parts.slice(-1 * numPathParts).join('/');
    }

    if (preserveHost) {
      name = `${parsedUrl.host}/${name.replace(/^\//, '')}`;
    }
    if (preserveQuery) {
      name = `${name}${parsedUrl.search}`;
    }
  }

  const MAX_LENGTH = 64;
  // Always elide hexadecimal hash
  name = name.replace(/([a-f0-9]{7})[a-f0-9]{13}[a-f0-9]*/g, `$1${ELLIPSIS}`);
  // Also elide other hash-like mixed-case strings
  name = name.replace(
    /([a-zA-Z0-9-_]{9})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9-_]{10,}/g,
    `$1${ELLIPSIS}`
  );
  // Also elide long number sequences
  name = name.replace(/(\d{3})\d{6,}/g, `$1${ELLIPSIS}`);
  // Merge any adjacent ellipses
  name = name.replace(/\u2026+/g, ELLIPSIS);

  // Elide query params first
  if (name.length > MAX_LENGTH && name.includes('?')) {
    // Try to leave the first query parameter intact
    name = name.replace(/\?([^=]*)(=)?.*/, `?$1$2${ELLIPSIS}`);

    // Remove it all if it's still too long
    if (name.length > MAX_LENGTH) {
      name = name.replace(/\?.*/, `?${ELLIPSIS}`);
    }
  }

  // Elide too long names next
  if (name.length > MAX_LENGTH) {
    const dotIndex = name.lastIndexOf('.');
    if (dotIndex >= 0) {
      name =
        name.slice(0, MAX_LENGTH - 1 - (name.length - dotIndex)) +
        // Show file extension
        `${ELLIPSIS}${name.slice(dotIndex)}`;
    } else {
      name = name.slice(0, MAX_LENGTH - 1) + ELLIPSIS;
    }
  }

  return name;
}
const URL_PREFIXES = ['http://', 'https://', 'data:'];
/**
 * Split a URL into a file, hostname and origin for easy display.
 * @param {string} url
 * @return {{file: string, hostname: string, origin: string}}
 */
export function parseURL(url) {
  const parsedUrl = new URL(url);
  return {
    file: getURLDisplayName(parsedUrl),
    hostname: parsedUrl.hostname,
    origin: parsedUrl.origin,
  };
}

export function isURL(value) {
  if (URL_PREFIXES.some(prefix => value.startsWith(prefix))) {
    return true;
  } else {
    return false;
  }
}

//byte转大单位
export function bytesToSize(bytes) {
  bytes = Number(bytes);
  if (bytes === 0) return 'None';
  const k = 1024, // or 1000
    sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  const result = (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
  return result;
}

// //ms转大单位
// export function msToSize(ms) {
//   ms = Number(ms)
//   if (bytes === 0) return '0 B';
//   var k = 1000, // or 1000
//   sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
//   i = Math.floor(Math.log(bytes) / Math.log(k));
//   const result = (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
//   return result
// }
/**
 * Converts a time in milliseconds into a duration string, i.e. `1d 2h 13m 52s`
 * @param {number} timeInMilliseconds
 * @return {string}
 */
export function formatDuration(timeInMilliseconds) {
  let timeInSeconds = timeInMilliseconds / 1000;
  if (Math.round(timeInSeconds) === 0) {
    return 'None';
  }

  /** @type {Array<string>} */
  const parts:string[]= [];
  /** @type {Record<string, number>} */
  const unitLabels = {
    d: 60 * 60 * 24,
    h: 60 * 60,
    m: 60,
    s: 1,
  };

  Object.keys(unitLabels).forEach(label => {
    const unit = unitLabels[label];
    const numberOfUnits = Math.floor(timeInSeconds / unit);
    if (numberOfUnits > 0) {
      timeInSeconds -= numberOfUnits * unit;
      parts.push(`${numberOfUnits}\xa0${label}`);
    }
  });

  return parts.join(' ');
}

//处理lighouse建议详情中的数据格式
export function handleObjectType(obj) {
  Object.keys(obj).forEach(key => {
    // First deal with the possible object forms of value.
    if (typeof obj[key] === 'object') {
      // The value's type overrides the heading's for this column.
      switch (obj[key].type) {
        case 'code': {
          obj[key] = obj[key].value;
          break;
        }
        case 'link': {
          break;
        }
        case 'node': {
          break;
        }
        case 'numeric': {
          break;
        }
        case 'source-location': {
          break;
        }
        case 'url': {
          obj[key] = obj[key].value;
          break;
        }
      }
    }
  });
}
