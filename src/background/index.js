import { CONFIG } from '../config';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set(CONFIG.DEFAULT_OPTIONS, function() {
    console.log('HiveExtension::Set options to defaults: ', CONFIG.DEFAULT_OPTIONS);
  });
});
