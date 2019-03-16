import { CONFIG } from '../../../config';

console.log('config is ', CONFIG);

const PROFILE_SCORE_EXTENSION_CLASS_NAME = 'HiveExtension-Twitter_profile-score';
const PROFILE_SIDEBAR_SELECTOR = '.ProfileSidebar';
const PROFILE_NAV_SELECTOR = '.ProfileNav';

export class TwitterProfileScoreExtension {
  api;

  constructor(_api) {
    this.api = _api;
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

    const { score: allCryptoScore } = await this.api.getTwitterUserScore(userTwitterId, 'Crypto');
    const {
      score: defaultClusterScore,
      name: defaultClusterName
    } = await this.api.getTwitterUserScore(userTwitterId);
    const clusters = await this.api.getTwitterUserClusters(userTwitterId);

    this.displayUserScore(defaultClusterScore, defaultClusterName, allCryptoScore, clusters);
  }

  async displayUserScore(defaultClusterScore, defaultClusterName, allCryptoScore, clusters) {
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

    const displayPopup = () => {
      const HOVER_POPUP_CLASS_NAME = 'HiveExtension-Twitter_popup-profile';

      if (displayElement.querySelector(`.${HOVER_POPUP_CLASS_NAME}`)) {
        return;
      }

      const roundedAllCryptoScore = Math.round(allCryptoScore);
      const cryptoPercentage = Math.floor((roundedAllCryptoScore / CONFIG.MAX_SCORE) * 100);

      const popupNode = document.createElement('div');
      popupNode.className = HOVER_POPUP_CLASS_NAME;

      let clustersHTML = ``;

      clusters.map(cluster => {
        if (cluster.abbr === 'Crypto') {
          return;
        }

        const roundedScore = Math.round(cluster.score);
        const percentage = Math.floor((roundedScore / CONFIG.MAX_SCORE) * 100);

        clustersHTML += `
        <div class="HiveExtension-Twitter_popup-profile_cluster-score">
            <div class="HiveExtension-Twitter_popup-profile_cluster-score_left">
                ${cluster.display}
            </div>
            <div class="HiveExtension-Twitter_popup-profile_cluster-score_right">
                <span class="HiveExtension-Twitter_popup-profile_cluster-score_right_bold">${roundedScore}</span>
                <span class="HiveExtension-Twitter_popup-profile_cluster-score_right_small">/ 1000</span>
            </div>
            <div class="HiveExtension-Twitter_popup-profile_cluster-score_progress-bar">
                <div class="HiveExtension-Twitter_popup-profile_cluster-score_progress-bar_bg"></div>
                <div class="HiveExtension-Twitter_popup-profile_cluster-score_progress-bar_progress" style="width:${percentage}%"></div>
            </div>
        </div>
        `;
      });

      const CUSTOM_HTML = `
        <h3>PeopleScore</h3>
        <div class="radial-progress" data-progress="${cryptoPercentage}">
            <div class="circle">
                <div class="mask full">
                    <div class="fill"></div>
                </div>
                <div class="mask half">
                    <div class="fill"></div>
                    <div class="fill fix"></div>
                </div>
            </div>
            <div class="circle_inset">
                <div class="percentage">
                    <div class="numbers">
                        <span class="numbers_main">${roundedAllCryptoScore}</span>
                        <span class="numbers_helper">AVERAGE SCORE</span>
                    </div>
                </div>
            </div>
        </div>
        ${clustersHTML}
    `;
      popupNode.innerHTML = CUSTOM_HTML;
      displayElement.appendChild(popupNode);

      setTimeout(() => {
        const closePopup = event => {
          if (event.target === popupNode || popupNode.contains(event.target)) {
            return;
          }

          displayElement.querySelector(`.${HOVER_POPUP_CLASS_NAME}`).remove();

          document.removeEventListener('click', closePopup);
        };

        document.addEventListener('click', closePopup);
      }, 0);
    };

    displayElement.addEventListener('click', displayPopup, false);

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
