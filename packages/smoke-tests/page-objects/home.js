'use strict';

const BasePageObject = require('./-base');

class Home extends BasePageObject {
  get beginButton() {
    return this._create('[href="/chat"]');
  }

  async visit() {
    return await this._browser.url(this.host);
  }
}

module.exports = Home;
