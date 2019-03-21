import './popup.scss';

const SETTINGS_SELECTS = [
  ['#cluster-options-select', 'clusterToDisplay'],
  ['#display-settings-select', 'displaySetting']
];

SETTINGS_SELECTS.forEach(([selector, name]) => {
  const element = document.querySelector(selector);

  chrome.storage.sync.get([name], result => {
    element.querySelector(`option[value="${result[name]}"]`).selected = true;
  });

  element.addEventListener('change', event => {
    const newValue = event.target.value;

    chrome.storage.sync.set({
      [name]: newValue
    });
  });
});

const USE_ICONS_CHECKBOX = document.querySelector('#use-icons');

chrome.storage.sync.get(['useIcons'], result => {
  USE_ICONS_CHECKBOX.checked = result.useIcons;
});

USE_ICONS_CHECKBOX.addEventListener('click', event => {
  chrome.storage.sync.set({
    useIcons: event.target.checked
  });
});
