import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { once, later } from '@ember/runloop';
import { waitForPromise } from 'ember-test-waiters';

import { action } from '@ember/object';

import { inject as service } from '@ember/service';

import StoreService from 'ember-data/store';
import MessageDispatcher from 'emberclear/services/messages/dispatcher';
import MessageFactory from 'emberclear/services/messages/factory';
import Channel from 'emberclear/models/channel';
import Contact from 'emberclear/models/contact';
import { unicode } from 'emojis';

const EMOJI_REGEX = /:[^:]+:/g;

interface IArgs {
  to: Contact | Channel;
}

export default class ChatEntry extends Component<IArgs> {
  @service('messages/dispatcher') messageDispatcher!: MessageDispatcher;
  @service('messages/factory') messageFactory!: MessageFactory;
  @service store!: StoreService;

  @tracked text?: string;
  @tracked isDisabled = false;

  textarea!: HTMLTextAreaElement;

  get placeholder() {
    const { to } = this.args;
    let prefix = '';

    if (to instanceof Channel) {
      prefix = 'everyone in ';
    }

    return `Send a message to ${prefix}${to.name}`;
  }

  get isSubmitDisabled() {
    return !this.text || this.text.length === 0 || this.isDisabled;
  }

  @action onInsertTextArea(element: HTMLTextAreaElement) {
    this.textarea = element;
    this.focus(element);
  }

  @action focus(element: HTMLElement) {
    element.focus();
  }

  @action resize(element: HTMLTextAreaElement) {
    element.style.cssText = 'height:auto;';
    element.style.cssText = 'height:' + element.scrollHeight + 'px';
  }

  @action async sendMessage() {
    if (!this.text) return;

    this.isDisabled = true;

    await this.dispatchMessage(this.text);

    // removing this later causes the input field to not actually get
    // cleared
    once(this, () => {
      this.isDisabled = false;
      this.text = '';

      // this feels hacky :-\
      later(() => {
        this.textarea.focus();
        this.textarea.style.height = null;
      }, 1);
    });
  }

  @action onInput(event: KeyboardEvent) {
    const value = (event.target as any).value;

    if (EMOJI_REGEX.test(value)) {
      this.text = unicode(value);
    } else {
      this.text = value;
    }
  }

  @action onKeyPress(event: KeyboardEvent) {
    const { keyCode, shiftKey } = event;

    // don't submit when shift is being held.
    if (!shiftKey && keyCode === 13) {
      this.sendMessage();

      // prevent regular 'Enter' from inserting a linebreak
      return false;
    }

    return false;
  }

  async dispatchMessage(text: string) {
    await waitForPromise(this.messageDispatcher.send(text, this.args.to));
  }
}
