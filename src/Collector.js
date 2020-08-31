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
      // if (title.innerHTML.includes('DECLARED') && !title.innerHTML.includes('REDUCED')) {
      if (/declared/i.test(title.innerHTML) && !(/reduced/i).test(title.innerHTML)) {
        const table = parent.querySelectorAll('table')[0];
        const rows = table.querySelectorAll('tbody > tr');
        this.parser.runwayRows(rows);
      }
    });
    // check for intersection table index
    if (this.parser.getIntersectionTable()) {
      titles.forEach((title) => {
        const parent = title.parentElement;
        // if (title.innerHTML.includes('DECLARED') && !title.innerHTML.includes('REDUCED')) {
        if (/declared/i.test(title.innerHTML) && !(/reduced/i).test(title.innerHTML)) {
          const table = parent.querySelectorAll('table')[this.parser.getIntersectionTable()];
          const rows = table?.querySelectorAll('tbody > tr');
          this.parser.intxRows(rows);
        }
      });
    }
    // check for intersection table name
    if (this.parser.getIntersectionTableTitle()) {
      // name set, look for another table
      titles.forEach((title) => {
        const parent = title.parentElement;
        if (title.innerHTML.includes(this.parser.getIntersectionTableTitle())) {
          const rows = parent.querySelectorAll('table > tbody > tr');
          this.parser.intxRows(rows);
        }
      });
    }

    // run loop again
    titles.forEach((title) => {
      const parent = title.parentElement;
      if (/physical/i.test(title.innerHTML)) {
        const table = parent.querySelectorAll('table')[this.parser.getRunwayCharasteristicsTable()];
        const rows = table.querySelectorAll('tbody > tr');
        this.parser.runwayCharacteristics(rows);
      }
    });
  }

  async retrieveTable() {
    await page().goto(this.parser.getLink());
    // await page().waitForSelector('frame[name=eAISContent]');

    // const frame = page().frames().find((item) => item.name() === 'eAISContent');
    // await frame.waitForNavigation();
    // eslint-disable-next-line no-undef
    return page().evaluate(() => document.querySelector('body').innerHTML);
  }
}

module.exports = Collector;
