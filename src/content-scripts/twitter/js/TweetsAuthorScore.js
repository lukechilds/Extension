import { ProfilePopup } from './ProfilePopup';

const TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME = 'HiveExtension-Twitter_tweet-author-score';
const TWEETS_SELECTOR = '.tweet';

export class TwitterTweetsAuthorScoreExtension {
  api;

  constructor(_api) {
    this.api = _api;
  }

  async start() {
    this.addScoreToTweetFooter();
  }

  async addScoreToTweetFooter() {
    document.querySelectorAll(TWEETS_SELECTOR).forEach(async tweet => {
      const processedClassName = `${TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME}-processed`;

      if (tweet.classList.contains(processedClassName)) {
        return;
      }

      tweet.classList.add(processedClassName);

      const authorId = tweet.getAttribute('data-user-id');

      const { name: clusterName, score: userScore } = await this.api.getTwitterUserScore(authorId);

      const userScoreDisplay = document.createElement('div');
      userScoreDisplay.classList.add(TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME);
      userScoreDisplay.classList.add('ProfileTweet-action');
      userScoreDisplay.innerHTML = `<button class="${TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME}_display ProfileTweet-actionButton js-tooltip" data-original-title="${clusterName} Score">

      <div class="IconContainer">
          <span class="Icon Icon--medium">
            <svg viewBox="0 0 36 36" class="${TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME}_display_icon">
              <use xlink:href="#hive-icon" />
            </svg>
          </span>
        </div>

      <span class="ProfileTweet-actionCount">
        <span class="${TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME}_display_score">${Math.round(
        userScore
      )}</span>
      </span>

      </button>
      `;

      const popup = new ProfilePopup(authorId, this.api);
      popup.showOnClick(userScoreDisplay);

      const actionList = tweet.querySelector('.ProfileTweet-actionList');

      if (actionList) {
        actionList.appendChild(userScoreDisplay);
      }
    });
  }
}
