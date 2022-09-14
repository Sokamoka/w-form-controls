export const matchCaps = (value, source) => {
  source = source || '';
  const result = value || '';
  const regex = new RegExp(escapeStringRegexp(source), 'i');
  return result.replace(regex, source);
};

/**
 * based on: https://github.com/sindresorhus/escape-string-regexp/blob/v4.0.0/index.js
 *   copied here because babel preset-env `useBuiltIns: 'usage'` expects es modules
 *   as inputs. at least it expected a `default` export which wasn't the case
 */
export const escapeStringRegexp = (string) => {
  // if (isNotString(string)) throw new TypeError('Expected a string');

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a \unnnn escape
  //  when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&').replaceAll('-', '\\x2d');
};
