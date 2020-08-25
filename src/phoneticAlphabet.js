const phoneticAlphabet = {
  constants: {
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
  },
  invertedConstants() {
    const result = {};
    this.constants.forEach((key) => {
      result[this.constants[key]] = key;
    });
    return result;
  },
  stringify(string) {
    let result = string.toUpperCase();
    this.constants.forEach((word) => {
      result = result.replace(word, this.constants[word]);
    });
    return result;
  },
};
module.exports = phoneticAlphabet;
