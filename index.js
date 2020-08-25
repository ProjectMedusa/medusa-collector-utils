const AirportCollector = require('./src/AirportCollector');
const Collector = require('./src/Collector');
const Page = require('./src/Page');

const phoneticAlphabet = require('./src/phoneticAlphabet');

const legacy = require('./src/legacy');

module.exports = {
  AirportCollector, Collector, Page, phoneticAlphabet, ...legacy,
};
