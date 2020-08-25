const { JSDOM } = require('jsdom');
const { getPage: page } = require('./Page');

class Collector {
  constructor(parser, link, airport) {
    this.parser = parser;
    this.link = link;
    this.airport = airport;
  }

  async retriveAndParseTable() {
    const html = await this.retrieveTable();
    await this.parseTableWithParser(html);
  }

  async parseTableWithParser(html) {
    const { doc } = new JSDOM(html).window;
    const titles = doc.querySelectorAll('.Title');
    titles.forEach((title) => {
      if (title.innerHTML.includes('DECLARED')) {
        const parent = title.parentElement;
        const rows = parent.querySelectorAll('table > tbody > tr');
        this.parser.runwayRows(rows, this.airport);
      }
    });
  }

  async retrieveTable() {
    await page().goto(this.link);
    await page().waitForSelector('frame[name=eAISContent]');

    const frame = page().frames().find((item) => item.name() === 'eAISContent');
    await frame.waitForNavigation();
    // eslint-disable-next-line no-undef
    return frame.evaluate(() => document.querySelector('body').innerHTML);
  }
}

module.exports = Collector;
