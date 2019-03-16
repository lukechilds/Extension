import './popup.scss';

const SETTINGS_SELECTS = [
  ['#cluster-options-select', 'clusterToDisplay'],
  ['#display-settings-select', 'displaySetting']
];

SETTINGS_SELECTS.forEach(([selector, name]) => {
  const element = document.querySelector(selector);

  chrome.storage.sync.get([name], result => {
    console.log('result', result);
    element.querySelector(`option[value="${result[name]}"]`).selected = true;
  });

  element.addEventListener('change', event => {
    const newValue = event.target.value;

    chrome.storage.sync.set({
      [name]: newValue
    });
  });
});
