'use strict';

const { BasePageObject } = require('@faltest/page-objects');

class BasePage extends BasePageObject {
  constructor(host, ...args) {
    super(...args);

    this.host = host;
  }
}

module.exports = BasePage;
