export class ExtensionSettings {
  get isDarkTheme() {
    return Boolean(document.querySelector('.js-nightmode-icon.Icon--crescentFilled'));
  }
}
