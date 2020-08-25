/* eslint-disable no-restricted-syntax */
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const fs = require('fs').promises;

async function findCoveredAirports(page, aoi) {
  // fs.access("../cache/" + aoi + "_airports.json", fs.constants.F_OK, (err) => {
  //     console.log(err ? 'should check' : 'exists');

  // });

  if (!require('fs').existsSync(`cache/${aoi}_airports.json`)) {
    const aerodromes = await page.$('[title=AERODROMES]');
    await aerodromes.click();
    const childrenContainerId = `${await (await aerodromes.getProperty('id')).jsonValue()}details`;

    // eslint-disable-next-line no-use-before-define
    const childrenContainerHTML = await page.evaluate((id) => document.querySelector(`#${id}`).outerHTML, childrenContainerId);

    const { document } = new JSDOM(childrenContainerHTML).window;

    const children = document.querySelectorAll('*');

    const coveredAerodromes = [];
    const rx = new RegExp(`AD-2.(${aoi}[A-Z][A-Z])details`);

    for (const child of children) {
      const id = child.getAttribute('id');
      if (rx.test(id)) {
        const match = id.match(rx);
        coveredAerodromes.push(match[1]);
      }
    }
    await fs.writeFile(
      `cache/${aoi}_airports.json`,
      JSON.stringify(coveredAerodromes),
      'utf8',
    );
    return coveredAerodromes;
  }
  return JSON.parse(await fs.readFile(`cache/${aoi}_airports.json`));
}

async function retrieveAndParseTable(page, link, airport, parser) {
  await page.goto(link);
  await page.waitForSelector('frame[name=eAISContent]');

  const frame = page.frames().find((item) => item.name() === 'eAISContent');
  await frame.waitForNavigation();
  // eslint-disable-next-line no-use-before-define
  const html = await frame.evaluate(() => document.querySelector('body').innerHTML);

  const { document } = new JSDOM(html).window;
  const titles = document.querySelectorAll('.Title');
  for (const title of titles) {
    if (title.innerHTML.includes('DECLARED')) {
      const parent = title.parentElement;
      const rows = parent.querySelectorAll('table > tbody > tr');
      parser.runwayRows(rows, airport);
    }
  }
}

module.exports = { findCoveredAirports, retrieveAndParseTable };
