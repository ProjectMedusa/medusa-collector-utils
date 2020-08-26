const fs = require('fs').promises;
const { JSDOM } = require('jsdom');
const { getPage: page } = require('./Page');

class AirportCollector {
  constructor(aoi, aerodromeParseFunction) {
    this.aoi = aoi;
    this.aerodromeParseFunction = aerodromeParseFunction;
  }

  async findCoveredAirports() {
    return this.cacheOrFind();
  }

  async cacheOrFind() {
    if (!require('fs').existsSync(`cache/${this.aoi}_airports.json`)) {
      const aerodromes = await page().$('[title=AERODROMES]');
      await aerodromes.click();
      const childrenContainerId = `${await (await aerodromes.getProperty('id')).jsonValue()}details`;

      // eslint-disable-next-line no-use-before-define
      const childrenContainerHTML = await page().evaluate((id) => document.querySelector(`#${id}`).outerHTML, childrenContainerId);

      const { document } = new JSDOM(childrenContainerHTML).window;

      const children = document.querySelectorAll('*');

      const coveredAerodromes = [];

      children.forEach((child) => {
        const result = this.aerodromeParseFunction(child);
        if (result) {
          coveredAerodromes.push(result);
        }
      });

      this.cacheAirports(coveredAerodromes);
      return coveredAerodromes;
    }
    return JSON.parse(await fs.readFile(`cache/${this.aoi}_airports.json`));
  }

  async cacheAirports(coverage) {
    await fs.writeFile(
      `cache/${this.aoi}_airports.json`,
      JSON.stringify(coverage),
      'utf8',
    );
  }
}

module.exports = AirportCollector;
