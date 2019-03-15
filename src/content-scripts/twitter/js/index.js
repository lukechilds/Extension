import '../styles/twitter.scss';
import { CustomCache } from './CustomCache';
import { HiveAPI } from './HiveAPI';
import { TwitterProfileScoreExtension } from './TwitterProfileScore';
import { TwitterTweetsAuthorScoreExtension } from './TweetsAuthorScore';
import { CONFIG } from '../../../config';

const observeDOM = (() => {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
    eventListenerSupported = window.addEventListener;

  return (element, callback) => {
    if (MutationObserver) {
      const observer = new MutationObserver(mutations => {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) callback();
      });

      observer.observe(element, { childList: true, subtree: true });
    } else if (eventListenerSupported) {
      element.addEventListener('DOMNodeInserted', callback, false);
      element.addEventListener('DOMNodeRemoved', callback, false);
    }
  };
})();

function isOptionEnabled(name) {
  return new Promise(resolve => {
    chrome.storage.sync.get([name], result => resolve(result[name]));
  });
}

(async () => {
  const cache = new CustomCache();
  const api = new HiveAPI(CONFIG.API_HOST, cache);
  const twitterProfileScore = new TwitterProfileScoreExtension(api);
  const twitterTweetsAuthorScoreExtension = new TwitterTweetsAuthorScoreExtension(api);

  async function runExtensions() {
    if (await isOptionEnabled('alwaysDisplayCryptoScoreOnProfiles')) {
      await twitterProfileScore.start();
      await twitterTweetsAuthorScoreExtension.start();
    }
  }

  observeDOM(document.getElementsByTagName('body')[0], runExtensions);
})();
