'use strict';

const BasePageObject = require('./-base');
const Sidebar = require('./sidebar');

class Home extends BasePageObject {
  constructor(...args) {
    super(...args);

    this.sidebar = new Sidebar(...args);
  }

  get appLoader() {
    return this._create('#app-loader');
  }

  get beginButton() {
    return this._create('[href="/chat"]');
  }

  async visit() {
    await this._browser.url(this.host);

    await this._browser.waitUntil(async () => {
      return this._create('.top-nav');
    });

  }
}

module.exports = Home;
