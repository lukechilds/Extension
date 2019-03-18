import { CONFIG } from '../../../config';
import { ProfilePopup } from './ProfilePopup';

console.log('config is ', CONFIG);

const PROFILE_SCORE_EXTENSION_CLASS_NAME = 'HiveExtension-Twitter_profile-score';
const PROFILE_SIDEBAR_SELECTOR = '.ProfileSidebar';
const PROFILE_NAV_SELECTOR = '.ProfileNav';

export class TwitterProfileScoreExtension {
  _api;
  _settings;

  constructor(api, settings) {
    this._api = api;
    this._settings = settings;
  }

  getUserId() {
    const profileNav = document.querySelector(PROFILE_NAV_SELECTOR);

    if (profileNav) {
      return profileNav.getAttribute('data-user-id');
    }
  }

  async start() {
    if (!this.isOnProfileScreen() || this.hasAlreadyRun()) {
      return;
    }

    const userTwitterId = this.getUserId();

    if (userTwitterId === this.previousUserId) {
      return;
    }

    this.previousUserId = userTwitterId;

    const {
      score: defaultClusterScore,
      name: defaultClusterName
    } = await this._api.getTwitterUserScore(userTwitterId);

    this.displayUserScore(defaultClusterScore, defaultClusterName);
  }

  async displayUserScore(defaultClusterScore, defaultClusterName) {
    const roundedDefaultClusterScore = Math.round(defaultClusterScore);

    const displayElement = document.createElement('div');
    displayElement.classList.add('ProfileNav-item');
    displayElement.classList.add(PROFILE_SCORE_EXTENSION_CLASS_NAME);
    displayElement.innerHTML = `
            <div class="ProfileNav-stat ProfileNav-stat--link u-borderUserColor u-textCenter js-tooltip js-nav u-textUserColor" href="#" data-original-title="${defaultClusterName} Score ${roundedDefaultClusterScore}">
                  <span class="ProfileNav-label">${defaultClusterName} Score</span>
                  <span class="ProfileNav-value" data-count="${roundedDefaultClusterScore}" data-is-compact="false">${roundedDefaultClusterScore}</span>
            </div>
        `;

    const popup = new ProfilePopup(this.getUserId(), this._api, this._settings);
    popup.showOnClick(displayElement);

    document
      .querySelector('.ProfileNav-item:nth-of-type(4)')
      .insertAdjacentElement('afterend', displayElement);
  }

  isOnProfileScreen() {
    return Boolean(document.querySelector(PROFILE_SIDEBAR_SELECTOR));
  }

  hasAlreadyRun() {
    return Boolean(document.querySelector(`.${PROFILE_SCORE_EXTENSION_CLASS_NAME}`));
  }
}
