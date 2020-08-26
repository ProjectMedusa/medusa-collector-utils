/* eslint-disable class-methods-use-this */
module.exports = class Parser {
  constructor(airport, link) {
    this.airport = airport;
    this.constructSourceLink(link);
  }

  constructSourceLink(link) {
    this.link = link.replace('$icao', this.airport);
  }

  getLink() {
    return this.link;
  }

  runwayRows() {
    throw new Error('Method must be overrided!');
  }
};
