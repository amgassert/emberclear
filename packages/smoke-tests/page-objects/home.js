'use strict';

const BasePageObject = require('./-base');
const Sidebar = require('./sidebar');

class Home extends BasePageObject {
  constructor(...args) {
    super(...args);

    this.sidebar = new Sidebar(...args);
  }

  get beginButton() {
    return this._create('[href="/chat"]');
  }

  async visit() {
    return await this._browser.url(this.host);
  }
}

module.exports = Home;
