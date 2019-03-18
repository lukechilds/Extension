import '../styles/twitter.scss';
import { CustomCache } from './CustomCache';
import { HiveAPI } from './HiveAPI';
import { TwitterProfileScoreExtension } from './TwitterProfileScore';
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

function getOptionValue(name) {
  return new Promise(resolve => {
    chrome.storage.sync.get([name], result => resolve(result[name]));
  });
}

(async () => {
  const clusterToDisplay = await getOptionValue('clusterToDisplay');

  const cache = new CustomCache();
  const api = new HiveAPI(CONFIG.API_HOST, clusterToDisplay, cache);
  const settings = new ExtensionSettings();

  const twitterProfileScore = new TwitterProfileScoreExtension(api);
  const twitterTweetsAuthorScoreExtension = new TwitterTweetsAuthorScoreExtension(api, settings);
  const icons = new ExtensionIcons();

  async function runExtensions() {
    icons.initialize();
    await twitterProfileScore.start();
    await twitterTweetsAuthorScoreExtension.start();
  }

  observeDOM(document.getElementsByTagName('body')[0], runExtensions);
})();
