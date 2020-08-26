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
* [Legacy API](#legacy)

-------

### **Collector**

* Description: The Collector parses the `html` document and calls specific [Parser](#parser) methods to further extract the information from the parsed `html`
* Type: `Class`
* Constructor Parameters:
  * `parser`:
    * type: instance of [Parser](#parser)
* Relevant Methods:
  * `findCoveredAirports`:
    * Async: **true**
    * Returns: `array[string]`
    * Description: This method either looks in cache or grabs and parses the covered airfields by an *eAIP*.
* Usage:

  ```js
   const { Collector } = require('@project-medusa/collector-utils');

   const collector = new Collector(...);
   ```

* Also see [MedusaCollector](https://github.com/ProjectMedusa/medusa-collector)

### **Parser**

* Description: The `Parser` class is where most of the bussiness logic happens. It's where the runway/intersection information is parsed. Each country, *AKA* **AOI** (area of interest), has their own unique parser as each country's information structure is different.

* Type: `Class`
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
