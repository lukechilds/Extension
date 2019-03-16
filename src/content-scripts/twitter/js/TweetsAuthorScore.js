const TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME = 'HiveExtension-Twitter_tweet-author-score';

export class TwitterTweetsAuthorScoreExtension {
  api;

  constructor(_api) {
    this.api = _api;
  }

  async start() {
    document.querySelectorAll('.stream .stream-items .stream-item .tweet').forEach(async tweet => {
      const processedClassName = `${TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME}-processed`;

      if (tweet.classList.contains(processedClassName)) {
        // console.log('ALREADY HAS TWEET AUTHOR SCORE');
        return;
      }

      // console.log('NEW TWEET')

      tweet.classList.add(processedClassName);

      const authorId = tweet.getAttribute('data-user-id');

      const { score: userScore } = await this.api.getTwitterUserScore(authorId);

      const tweetIsThread =
        Boolean(tweet.querySelector('.self-thread-tweet-cta')) ||
        tweet.parentElement.parentElement.classList.contains('ThreadedConversation-tweet');
      const isDarkTheme = Boolean(
        document.querySelector('.js-nightmode-icon.Icon--crescentFilled')
      );

      let threadClass = TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME + '_display-in-thread';

      if (isDarkTheme) {
        threadClass += '-dark';
      }

      const userScoreDisplay = document.createElement('div');
      userScoreDisplay.classList.add(TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME);
      userScoreDisplay.innerHTML = `<b class="${TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME}_display ${
        tweetIsThread ? threadClass : ''
      }">${Math.round(userScore)}</b>`;

      tweet.querySelector('.account-group').appendChild(userScoreDisplay);
    });
  }
}
