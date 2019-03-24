import { CONFIG } from '../../../config';

const PROFILE_HOVER_CONTAINER = '#profile-hover-container';
const ELEMENT_CLASS = 'HiveExtension-Twitter_profile-hover-popup';

export class TwitterProfileHoverPopupScoreExtension {
  _api;
  _settings;

  constructor(api, settings) {
    this._api = api;
    this._settings = settings;
  }

  getUserId() {
    const container = document.querySelector(PROFILE_HOVER_CONTAINER);

    if (container) {
      return container.getAttribute('data-user-id');
    }
  }

  async start() {
    const container = document.querySelector(PROFILE_HOVER_CONTAINER);

    if (
      !container ||
      container.querySelector(`.${ELEMENT_CLASS}`) ||
      container.style.display === 'none'
    ) {
      return;
    }

    const userTwitterId = this.getUserId();

    if (!userTwitterId) {
      return;
    }

    const {
      score: defaultClusterScore,
      name: defaultClusterName,
      rank: defaultClusterRank,
      indexed: accountIndexed
    } = await this._api.getTwitterUserScore(userTwitterId);

    this.displayUserScore(
      defaultClusterScore,
      defaultClusterRank,
      defaultClusterName,
      accountIndexed
    );
  }

  async displayUserScore(
    defaultClusterScore,
    defaultClusterRank,
    defaultClusterName,
    accountIndexed
  ) {
    let tooltip = CONFIG.NO_SCORE_TOOLTIP;
    let label = '';
    let value = CONFIG.NO_SCORE_TEXT;

    const option = await this._settings.getOptionValue('displaySetting');

    if (
      accountIndexed &&
      ['showRanksWithScoreFallback', 'showRanks'].includes(option) &&
      defaultClusterRank
    ) {
      value = `${defaultClusterRank}`;
      label = `${defaultClusterName} Rank`;
      tooltip = `${defaultClusterName} Rank ${defaultClusterRank}`;
    } else if (option !== 'showRanks') {
      label = `${defaultClusterName} Score`;

      if (accountIndexed) {
        value = Math.round(defaultClusterScore);
        tooltip = `${defaultClusterName} Score ${value}`;
      }
    }

    const displayElement = document.createElement('li');
    displayElement.classList.add('ProfileCardStats-stat');
    displayElement.classList.add('Arrange-sizeFit');
    displayElement.classList.add(ELEMENT_CLASS);

    displayElement.innerHTML = `
          <div class="ProfileCardStats-statLink u-textUserColor u-linkClean u-block js-nav js-tooltip" data-original-title="${tooltip}">
            <span class="ProfileCardStats-statLabel u-block" style="width: 76px">${label}</span>
            <span class="ProfileCardStats-statValue" style="text-align: center;" data-count="${value}" data-is-compact="false">${value}</span>
          </div>
        `;

    if (!label) {
      displayElement.style.display = 'none';
    }

    const statList = document.querySelector(
      `${PROFILE_HOVER_CONTAINER} .ProfileCardStats-statList`
    );

    if (statList) {
      statList.appendChild(displayElement);
    }
  }
}
