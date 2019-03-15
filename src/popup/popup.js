import './popup.scss';

const OPTION_ALWAYS_DISPLAY_CRYPTO_SCORE_ON_PROFILES_CHECKBOX = document.getElementsByName(
  'alwaysDisplayCryptoScoreOnProfiles'
)[0];

chrome.storage.sync.get(['alwaysDisplayCryptoScoreOnProfiles'], result => {
  console.log('result', result, result.alwaysDisplayCryptoScoreOnProfiles);
  OPTION_ALWAYS_DISPLAY_CRYPTO_SCORE_ON_PROFILES_CHECKBOX.checked =
    result.alwaysDisplayCryptoScoreOnProfiles;
});

OPTION_ALWAYS_DISPLAY_CRYPTO_SCORE_ON_PROFILES_CHECKBOX.onclick = event => {
  const newValue = event.target.checked;
  console.log('always display cry changed', newValue);

  chrome.storage.sync.set(
    {
      alwaysDisplayCryptoScoreOnProfiles: newValue
    },
    function() {
      console.log('set value to', newValue);
    }
  );
};
