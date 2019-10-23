'use strict';

const BasePageObject = require('./-base');

class Setup extends BasePageObject {
  get nameInput() {
    return this._create('input[type="text"]');
  }

  get nextButton() {
    return this._create('.cta-with-fallback .button');
  }

  async onboardSelf(name) {
    await this.nameInput.setValue(name);

    await this.nextButton.click();
    await this.nextButton.click();
  }
}

module.exports = Setup;
