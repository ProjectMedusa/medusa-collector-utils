const { JSDOM } = require('jsdom');
const { getPage: page } = require('./Page');

class Collector {
  constructor(parser) {
    this.parser = parser;
  }

  async retriveAndParseTable() {
    const html = await this.retrieveTable();
    await this.parseTableWithParser(html);
  }

  async parseTableWithParser(html) {
    const { document } = new JSDOM(html).window;
    const titles = document.querySelectorAll('.Title');
    titles.forEach((title) => {
      if (title.innerHTML.includes('DECLARED')) {
        const parent = title.parentElement;
        const rows = parent.querySelectorAll('table > tbody > tr');
        this.parser.runwayRows(rows);
      }
    });
  }

  async retrieveTable() {
    await page().goto(this.parser.getLink());
    await page().waitForSelector('frame[name=eAISContent]');

    const frame = page().frames().find((item) => item.name() === 'eAISContent');
    await frame.waitForNavigation();
    // eslint-disable-next-line no-undef
    return frame.evaluate(() => document.querySelector('body').innerHTML);
  }
}

module.exports = Collector;
