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

      const userScore = await this.api.getTwitterUserScore(authorId);

      const userScoreDisplay = document.createElement('div');
      userScoreDisplay.classList.add(TWEET_AUTHOR_SCORE_EXTENSION_CLASS_NAME);
      userScoreDisplay.innerHTML = `<b>${Math.round(userScore)}</b>`;

      tweet.querySelector('.account-group').appendChild(userScoreDisplay);
    });
  }
}
