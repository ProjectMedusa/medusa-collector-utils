# medusa-collector-utils

medusa-collector-utils is a utility package used by [MedusaCollector](https://github.com/ProjectMedusa/medusa-collector)

## Installation

```bash
npm i @project-medusa/collector-utils
```

## Usage

For a better understanding of how this package is used, please take a look at the [MedusaCollector](https://github.com/ProjectMedusa/medusa-collector) package mentioned above.

## API

### Table Of Contents

* Classes
  * [Collector](#collector)
  * [Parser](#parser)
  * [AirportCollector](#airportCollector)
* [Page](#page)
* [Legacy API](#legacy)

-------

### **AirportCollector**

* Description: The `AirportCollector` class's purpose is to find out which airports are covered by a specific *eAIP*. It also caches the results under `cache/XX_airports.json`
* Type: `class`
* Constructor Parameters:
  * `aoi`:
    * Type: `string`
    * Description: 2-letter area code (EG, EY, EV, ...)
  * `aerodromeParseFunction`
    * Type: `function`
    * Description: This function is called to parse out an *eAIP* aerodrome line. Examples:
      * `EYVI/Vilnius ->` *aerodromeParseFunction* `-> EYVI`
      * `EYVI Vilnius ->` *aerodromeParseFunction* `-> EYVI`
* Relevant Methods:
  * `findCoveredAirports`:
    * Async: **true**
    * Returns: `array[string]`
    * Description: This method either looks in cache or grabs and parses the covered airfields by an *eAIP*.
* Usage:

```js
  const { AirportCollector } = require('@project-medusa/collector-utils')

  const airportCollector = new AirportCollector(process.env.AOI, parseAerodromeString);
```

* Also see [MedusaCollector](https://github.com/ProjectMedusa/medusa-collector)

### **Collector**

* Description: The Collector parses the `html` document and calls specific [Parser](#parser) methods to further extract the information from the parsed `html`
* Type: `class`
* Constructor Parameters:
  * `parser`:
    * Type: instance of [Parser](#parser)
* Relevant Methods:
  * `retriveAndParseTable`
    * Async: **true**
    * Returns: `void`
    * Description: This method calls the specific country parsers to parse out an `HTML Table` row.
* Usage:

  ```js
   const { Collector } = require('@project-medusa/collector-utils');

   const collector = new Collector(...);
   ```

* Also see [Parser](#parser)
* Also see [MedusaCollector](https://github.com/ProjectMedusa/medusa-collector)

### **Parser**

* Description: The `Parser` class is where most of the bussiness logic happens. It's where the runway/intersection information is parsed. Each country, *AKA* **AOI** (area of interest), has their own unique parser as each country's information structure is different.

* Type: `class`
* Constructor Parameters:
  * `airport`
    * Type: `string`
    * Description: 4-letter airport *ICAO* code
  * `link`
    * Type: `string`
* Relevant Methods:
  * `runwayRows`
    * Throws: an **Error** if not overriden by inherited classes
    * Description: This method is called for each `HTML Table` row that contains runway/intersection data.
    * Returns: `void`
    * Parameters:
      * `rows`:
        * Type: `NodeList {}`
  * `save`
    * Async: **true**
    * Description: Saves runway results from `this.results` into `results/XXXX.json`
* Usage:

**Note: each inherited class *MUST* override a method called `runwayRows`, otherwise an error will be thrown**

```js
const { Parser } = require('@project-medusa/collector-utils');

class EY extends Parser {...}
```

* Also see [MedusaCollector](https://github.com/ProjectMedusa/medusa-collector)

### **Page**

* Description: meant for creating and retrieving a [puppeteer](https://github.com/puppeteer/puppeteer) page
* Type: `object`
* Relevant methods:
  * `createPage`
    * Parameters:
      * `params`
        * Type: `object`
        * Description: This params object is passed down to a puppeteer function called `puppeteer.launch();`
  * `getPage`
    * Description: returns the created [puppeteer](https://github.com/puppeteer/puppeteer) page.
* Usage:

```js
const { createPage, getPage: page } = require('@project-medusa/collector-utils').Page;

(async () => {

  await createPage({ headless: false, slowMo: 0, args: ['--user-agent=New User Agent'] });
  await page().goto(currentSource.menuLink);

})();


```

* Also see [MedusaCollector](https://github.com/ProjectMedusa/medusa-collector)