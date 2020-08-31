/* eslint-disable class-methods-use-this */
const fs = require('fs').promises;

module.exports = class Parser {
  constructor(airport,
    link, runwayCharacteristicsTable = 0,
    intersectionTableTitle = false,
    intersectionTable = false) {
    this.airport = airport;
    this.results = [];
    this.runwayCharacteristicsTable = runwayCharacteristicsTable;
    this.constructSourceLink(link);
    this.intersectionTableTitle = intersectionTableTitle;
    this.intersectionTable = intersectionTable;
  }

  constructSourceLink(link) {
    this.link = link.replace('$icao', this.airport);
  }

  getLink() {
    return this.link;
  }

  getIntersectionTableTitle() {
    return this.intersectionTableTitle;
  }

  getIntersectionTable() {
    return this.intersectionTable;
  }

  getRunwayCharasteristicsTable() {
    return this.runwayCharacteristicsTable;
  }

  async save() {
    this.beforeSave();
    await fs.writeFile(
      `results/${this.airport}.json`,
      JSON.stringify(this.results, null, '\t'),
      'utf-8',
    );
  }

  beforeSave() {

  }

  runwayRows() {
    throw new Error('Method must be overrided!');
  }

  runwayCharacteristics() {
    throw new Error('Method must be overrided!');
  }

  override(icao, callback) {
    if (this.airport === icao) {
      // eslint-disable-next-line no-console
      console.log(`Overriding ${icao}...`);
      this.results = callback(this.results);
    }
  }
};
