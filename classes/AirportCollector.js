const fs = require('fs').promises;
const { JSDOM } = require('jsdom');
const { getPage: page } = require('./Page');

class AirportCollector {
  constructor(aoi) {
    this.aoi = aoi;
  }

  async findCoveredAirports() {
    if (!require('fs').existsSync(`cache/${this.aoi}_airports.json`)) {
      const aerodromes = await page.$('[title=AERODROMES]');
      await aerodromes.click();
      const childrenContainerId = `${await (await aerodromes.getProperty('id')).jsonValue()}details`;

      // eslint-disable-next-line no-undef
      const childrenContainerHTML = await page.evaluate((id) => document.querySelector(`#${id}`).outerHTML, childrenContainerId);

      const { doc } = new JSDOM(childrenContainerHTML).window;

      const children = doc.querySelectorAll('*');

      const coveredAerodromes = [];
      const rx = new RegExp(`AD-2.(${this.aoi}[A-Z][A-Z])details`);

      children.forEach((child) => {
        const id = child.getAttribute('id');
        if (rx.test(id)) {
          const match = id.match(rx);
          coveredAerodromes.push(match[1]);
        }
      });
      await fs.writeFile(
        `cache/${this.aoi}_airports.json`,
        JSON.stringify(coveredAerodromes),
        'utf8',
      );
      return coveredAerodromes;
    }
    return JSON.parse(await fs.readFile(`cache/${this.aoi}_airports.json`));
  }
}

module.exports = AirportCollector;
