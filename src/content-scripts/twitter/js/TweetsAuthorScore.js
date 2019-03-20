import { ProfilePopup } from './ProfilePopup';
import { CONFIG } from '../../../config';

const TWEET_AUTHOR_SCORE_CLASS = 'HiveExtension-Twitter_tweet-author-score';
const TWEET_INDIVIDUAL_SCORE_CLASS = 'HiveExtension-Twitter_tweet-individual-score';
const TWEETS_SELECTOR = '.tweet';

export class TwitterTweetsAuthorScoreExtension {
  _api;
  _settings;

  constructor(api, settings) {
    this._api = api;
    this._settings = settings;
  }

  async start() {
    this.addScoreBelowProfilePicture();
  }

  async addScoreToTweetFooter() {
    document.querySelectorAll(TWEETS_SELECTOR).forEach(async tweet => {
      const processedClassName = `${TWEET_INDIVIDUAL_SCORE_CLASS}-processed`;

      if (tweet.classList.contains(processedClassName)) {
        return;
      }

      tweet.classList.add(processedClassName);

      const authorId = tweet.getAttribute('data-user-id');

      const { name: clusterName, score: userScore } = await this._api.getTwitterUserScore(authorId);

      const userScoreDisplay = document.createElement('div');
      userScoreDisplay.classList.add(TWEET_INDIVIDUAL_SCORE_CLASS);
      userScoreDisplay.classList.add('ProfileTweet-action');
      userScoreDisplay.innerHTML = `<button class="${TWEET_INDIVIDUAL_SCORE_CLASS}_display ProfileTweet-actionButton js-tooltip" data-original-title="${clusterName} Score">

      <div class="IconContainer">
          <span class="Icon Icon--medium">
            <svg viewBox="0 0 36 36" class="${TWEET_INDIVIDUAL_SCORE_CLASS}_display_icon">
              <use xlink:href="#hive-icon" />
            </svg>
          </span>
        </div>

      <span class="ProfileTweet-actionCount">
        <span class="${TWEET_INDIVIDUAL_SCORE_CLASS}_display_score">${Math.round(userScore)}</span>
      </span>

      </button>
      `;

      const popup = new ProfilePopup(authorId, this._api, this._settings);
      popup.showOnClick(userScoreDisplay);

      const actionList = tweet.querySelector('.ProfileTweet-actionList');

      if (actionList) {
        actionList.appendChild(userScoreDisplay);
      }
    });
  }

  async addScoreBelowProfilePicture() {
    document.querySelectorAll(TWEETS_SELECTOR).forEach(async tweet => {
      const processedClassName = `${TWEET_AUTHOR_SCORE_CLASS}-processed`;

      if (tweet.classList.contains(processedClassName)) {
        return;
      }

      tweet.classList.add(processedClassName);

      const authorId = tweet.getAttribute('data-user-id');

      const {
        name: defaultClusterName,
        score: userScore,
        rank: defaultClusterRank,
        indexed: accountIndexed
      } = await this._api.getTwitterUserScore(authorId);

      const tweetIsThread =
        Boolean(tweet.querySelector('.self-thread-tweet-cta')) ||
        tweet.parentElement.parentElement.classList.contains('ThreadedConversation-tweet') ||
        tweet.parentElement.classList.contains('conversation-first-visible-tweet') ||
        tweet.classList.contains('conversation-tweet');

      let threadClass = TWEET_AUTHOR_SCORE_CLASS + '_display-in-thread';

      if (this._settings.isDarkTheme) {
        threadClass += '-dark';
      }

      const option = await this._settings.getOptionValue('displaySetting');

      let value = CONFIG.NO_SCORE_TEXT;
      let tooltip = CONFIG.NO_SCORE_TOOLTIP;

      if (
        accountIndexed &&
        ['showRanksWithScoreFallback', 'showRanks'].includes(option) &&
        defaultClusterRank
      ) {
        value = `#${defaultClusterRank}`;
        tooltip = `${defaultClusterName} Rank ${defaultClusterRank}`;
      } else if (accountIndexed && option !== 'showRanks') {
        value = Math.round(userScore);
        tooltip = `${defaultClusterName} Score ${value}`;
      } else if (option === 'showRanks' && !accountIndexed) {
        value = '';
        tooltip = '';
      }

      if (!value || !tooltip) {
        return;
      }

      const userScoreDisplay = document.createElement('div');
      userScoreDisplay.classList.add(TWEET_AUTHOR_SCORE_CLASS);
      userScoreDisplay.innerHTML = `<b class="${TWEET_AUTHOR_SCORE_CLASS}_display ${
        tweetIsThread ? threadClass : ''
      } js-tooltip" data-original-title="${tooltip}">${value}</b>`;

      if (accountIndexed) {
        const popup = new ProfilePopup(authorId, this._api, this._settings);
        popup.showOnClick(userScoreDisplay);
      }

      const accountGroup = tweet.querySelector('.stream-item-header');

      if (accountGroup) {
        accountGroup.appendChild(userScoreDisplay);
      }
    });
  }
}
