import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

import StoreService from 'ember-data/store';
import SettingsService from 'emberclear/services/settings';
import { TABLET_WIDTH } from 'emberclear/utils/breakpoints';
import RouterService from '@ember/routing/router-service';
import Contact, { STATUS } from 'emberclear/models/contact';
import CurrentUserService from 'emberclear/services/current-user';

interface IArgs {
  contacts: Contact[];
  closeSidebar: () => void;
}

export default class ContactsSidebar extends Component<IArgs> {
  @service currentUser!: CurrentUserService;
  @service settings!: SettingsService;
  @service router!: RouterService;
  @service store!: StoreService;

  get allContacts(): Contact[] {
    return this.store.peekAll('contact').toArray();
  }

  get contacts() {
    const sortedContacts = this.allContacts.sort((a, b) =>
      a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1);
    if (!this.hideOfflineContacts) {
      return sortedContacts;
    }
    return sortedContacts.filter(contact => {
      return contact.onlineStatus !== STATUS.OFFLINE || contact.isPinned;
    });
  }

  get hideOfflineContacts() {
    return this.settings.hideOfflineContacts;
  }

  get offlineContacts() {
    return this.allContacts.filter(contact =>
      (contact.onlineStatus === STATUS.OFFLINE && !contact.isPinned));
  }

  get numberOffline() {
    return this.offlineContacts.length;
  }

  get showOfflineCounter() {
    return this.hideOfflineContacts && this.numberOffline > 0;
  }

  @action onClickAddFriend() {
    if (window.innerWidth < TABLET_WIDTH) {
      this.args.closeSidebar();
    }

    this.router.transitionTo('add-friend');
  }
}
