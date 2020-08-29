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
      const parent = title.parentElement;
      if (title.innerHTML.includes('DECLARED')) {
        const rows = parent.querySelectorAll('table > tbody > tr');
        this.parser.runwayRows(rows);
      }
    });
    // run loop again
    titles.forEach((title) => {
      const parent = title.parentElement;
      if (title.innerHTML.includes('PHYSICAL')) {
        const table = parent.querySelectorAll('table')[this.parser.getRunwayCharasteristicsTable()];
        const rows = table.querySelectorAll('tbody > tr');
        this.parser.runwayCharacteristics(rows);
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
