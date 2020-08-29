const constants = {
  ALPHA: 'A',
  BRAVO: 'B',
  CHARLIE: 'C',
  DELTA: 'D',
  ECHO: 'E',
  FOXTROT: 'F',
  GOLF: 'G',
  HOTEL: 'H',
  INDIA: 'I',
  JULIET: 'J',
  KILO: 'K',
  LIMA: 'L',
  MIKE: 'M',
  NOVEMBER: 'N',
  OSCAR: 'O',
  PAPA: 'P',
  QUEBEC: 'Q',
  ROMEO: 'R',
  SIERA: 'S',
  TANGO: 'T',
  UNIFORM: 'U',
  VICTOR: 'V',
  WHISKEY: 'W',
  XRay: 'X',
  YANKEE: 'Y',
  ZULU: 'Z',
};

const phoneticAlphabet = {
  constants,
  invertedConstants() {
    const result = {};
    constants.forEach((key) => {
      result[this.constants[key]] = key;
    });
    return result;
  },
  stringify(string) {
    let result = string.toUpperCase();
    Object.entries(constants).forEach(([word, letter]) => {
      result = result.replace(word, letter);
    });
    return result;
  },
};
module.exports = phoneticAlphabet;
