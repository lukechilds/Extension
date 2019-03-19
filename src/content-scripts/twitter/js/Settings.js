export class ExtensionSettings {
  get isDarkTheme() {
    return Boolean(document.querySelector('.js-nightmode-icon.Icon--crescentFilled'));
  }

  getOptionValue(name) {
    return new Promise(resolve => {
      chrome.storage.sync.get([name], result => resolve(result[name]));
    });
  }
}
