const PROFILE_SCORE_EXTENSION_CLASS_NAME = 'HiveExtension-Twitter_profile-score';
const PROFILE_SIDEBAR_SELECTOR = '.ProfileSidebar';
const PROFILE_NAV_SELECTOR = '.ProfileNav';

export class TwitterProfileScoreExtension {
  api;

  constructor(_api) {
    this.api = _api;
  }

  getUserId() {
    return document.querySelector(PROFILE_NAV_SELECTOR).getAttribute('data-user-id');
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

    const allCryptoScore = await this.api.getTwitterUserScore(userTwitterId);

    this.displayUserScore(allCryptoScore);
  }

  async displayUserScore(score) {
    const roundedScore = Math.round(score);

    const displayElement = document.createElement('div');
    displayElement.classList.add('ProfileNav-item');
    displayElement.classList.add(PROFILE_SCORE_EXTENSION_CLASS_NAME);
    displayElement.innerHTML = `
            <div class="ProfileNav-stat ProfileNav-stat--link u-borderUserColor u-textCenter js-tooltip js-nav u-textUserColor" href="#" data-original-title="Influence Score ${roundedScore}">
                  <span class="ProfileNav-label">Influence Score</span>
                  <span class="ProfileNav-value" data-count="${roundedScore}" data-is-compact="false">${roundedScore}</span>
            </div>
        `;

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
