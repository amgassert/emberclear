'use strict';

const BasePageObject = require('./-base');

class Sidebar extends BasePageObject {
  async open() {
    if (this.isOpen) return;

    await this.toggle();
  }

  async close() {
    if (!this.isOpen) return;

    await this.toggle();
  }

  async toggle() {
    this.toggleButton.click();
  }

  get isOpen() {
    this.main.getAttribute('style').includes('300');
  }

  get main() {
    return this._create('main');
  }

  get toggleButton() {
    return this._create('.navbar-burger');
  }

  get contacts() {
    return this._createMany('nav.contacts a');
  }

}

module.exports = Sidebar;
