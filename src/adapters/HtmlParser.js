const cheerio = require('cheerio');

class HtmlParser {
  /**
   * Parse raw HTML into a domain-friendly document wrapper around cheerio,
   * so checks never need to know cheerio's API directly.
   * @param {string} html
   */
  parse(html) {
    const $ = cheerio.load(html || '');

    return {
      $,
      getTitle: () => $('title').first().text().trim(),
      getMetaTag: (name) => $(`meta[name="${name}"]`).first().attr('content'),
      getMetaViewport: () => $('meta[name="viewport"]').first().attr('content'),
      getCanonical: () => $('link[rel="canonical"]').first().attr('href'),
      getImages: () => $('img').toArray().map((el) => ({
        src: $(el).attr('src'),
        alt: $(el).attr('alt'),
      })),
      getHeadings: (tag) => $(tag).toArray().map((el) => $(el).text().trim()),
      getAllHeadings: () => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].flatMap((tag) => (
        $(tag).toArray().map((el) => ({ tag, text: $(el).text().trim() }))
      )),
      getForms: () => $('form').toArray().map((el) => ({
        action: $(el).attr('action'),
        method: $(el).attr('method'),
        inputs: $(el).find('input, textarea, select').toArray().map((input) => ({
          name: $(input).attr('name'),
          type: $(input).attr('type'),
          required: $(input).attr('required') !== undefined,
        })),
      })),
      getScripts: () => $('script').toArray().map((el) => $(el).attr('src') || $(el).html() || ''),
      getRawHtml: () => html || '',
    };
  }
}

module.exports = new HtmlParser();
