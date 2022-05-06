// @related [test](/src/related.test.js)

/* Accepts a single string and returns an array of related file objects with `name` and `path` keys. */
function related(text) {
  return findAnnotatedLines(text).reduce((lines, line) => {
    return lines.concat(findLinks(line));
  }, []);
}

// // //

function findAnnotatedLines(text) {
  if (isNonEmptyString(text)) {
    return text.split("\n").filter((line) => /@related/.test(line));
  } else {
    return [];
  }
}

function findLinks(line) {
  const re = /[^\[]*\[([^\]]+)\]\(([^\)]+)\)/g;
  let result = [];
  let match;

  while ((match = re.exec(line))) {
    result.push({ name: match[1], path: match[2] });
  }

  return result;
}

function isNonEmptyString(s) {
  return s && typeof s == "string" && !/^\s*$/.test(s);
}

module.exports = {
  related,
  _findAnnotatedLines: findAnnotatedLines,
  _findLinks: findLinks,
};
