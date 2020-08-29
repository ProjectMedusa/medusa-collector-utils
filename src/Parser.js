/* eslint-disable class-methods-use-this */
const fs = require('fs').promises;

module.exports = class Parser {
  constructor(airport, link, runwayCharacteristicsTable = 0) {
    this.airport = airport;
    this.results = [];
    this.runwayCharacteristicsTable = runwayCharacteristicsTable;
    this.constructSourceLink(link);
  }

  constructSourceLink(link) {
    this.link = link.replace('$icao', this.airport);
  }

  getLink() {
    return this.link;
  }

  getRunwayCharasteristicsTable() {
    return this.runwayCharacteristicsTable;
  }

  async save() {
    await fs.writeFile(
      `results/${this.airport}.json`,
      JSON.stringify(this.results, null, '\t'),
      'utf-8',
    );
  }

  runwayRows() {
    throw new Error('Method must be overrided!');
  }

  runwayCharacteristics() {
    throw new Error('Method must be overrided!');
  }
};
