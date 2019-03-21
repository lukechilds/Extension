import '../styles/twitter.scss';
import { CustomCache } from './CustomCache';
import { HiveAPI } from './HiveAPI';
import { TwitterProfileScoreExtension } from './ProfileScore';
import { TwitterTweetsAuthorScoreExtension } from './TweetsAuthorScore';
import { CONFIG } from '../../../config';
import { ExtensionIcons } from './Icons';
import { ExtensionSettings } from './Settings';

const observeDOM = (() => {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
    eventListenerSupported = window.addEventListener;

  return (element, callback) => {
    if (MutationObserver) {
      const observer = new MutationObserver(mutations => {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          callback();
        }
      });

      observer.observe(element, { childList: true, subtree: true });
    } else if (eventListenerSupported) {
      element.addEventListener('DOMNodeInserted', callback, false);
      element.addEventListener('DOMNodeRemoved', callback, false);
    }
  };
})();

(async () => {
  const settings = new ExtensionSettings();

  const clusterToDisplay = await settings.getOptionValue('clusterToDisplay');

  const cache = new CustomCache();
  const api = new HiveAPI(CONFIG.API_HOST, clusterToDisplay, cache);

  const twitterProfileScore = new TwitterProfileScoreExtension(api, settings);
  const twitterTweetsAuthorScoreExtension = new TwitterTweetsAuthorScoreExtension(api, settings);
  const icons = new ExtensionIcons();

  const showScoreOnTweets = await settings.getOptionValue('showScoreOnTweets');

  async function runExtensions() {
    icons.initialize();
    await twitterProfileScore.start();

    if (showScoreOnTweets) {
      await twitterTweetsAuthorScoreExtension.start();
    }
  }

  observeDOM(document.getElementsByTagName('body')[0], runExtensions);
})();
