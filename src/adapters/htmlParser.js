'use strict';

const cheerio = require('cheerio');

/**
 * Adapter pattern: wraps cheerio so checks depend on a simple parse() method
 * rather than the cheerio API directly.
 */
class HtmlParser {
  parse(html) {
    return cheerio.load(html || '');
  }
}

module.exports = HtmlParser;
