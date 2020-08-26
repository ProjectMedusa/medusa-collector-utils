const puppeteer = require('puppeteer');

let page;

module.exports = {
  page,
  createPage: async (params) => {
    const browser = await puppeteer.launch(params);
    page = await browser.newPage();

    // prevents opening new windows
    browser.on('targetcreated', async (target) => {
      const newPage = await target.page();
      if (newPage) page.close();
    });
  },
};
