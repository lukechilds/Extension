import { CONFIG, MESSAGES } from '../config';

/* global ga */

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set(CONFIG.DEFAULT_OPTIONS, function() {
    console.log('HiveExtension::Set options to defaults: ', CONFIG.DEFAULT_OPTIONS);
  });
});

// Standard Google Universal Analytics code
(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  (i[r] =
    i[r] ||
    function() {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', CONFIG.GOOGLE_ANALYTICS_ID, 'auto');
ga('set', 'checkProtocolTask', () => {});
ga('send', 'pageview', '/');

chrome.runtime.onMessage.addListener(request => {
  switch (request.type) {
    case MESSAGES.TRACK_EVENT:
      ga('send', 'event', request.category, request.action);
      break;
  }
});
