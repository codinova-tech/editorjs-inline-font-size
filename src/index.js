
require('./index.css').toString();

class FontSizeTool {
  static title = 'Font Size';
  isDropDownOpen = false;
  togglingCallback = null;
  emptyString = '&nbsp;&nbsp';
  fontSizeDropDown = 'font-size-dropdown';

  static get sanitize() {
    return {
      font: {
        size: true,
        face: true
      },
    };
  }
  static get isInline() {
    return true;
  }
  commandName = 'fontSize';

  CSS = {
    button: 'ce-inline-tool',
    buttonActive: 'ce-font-size-tool--active',
    buttonModifier: 'ce-inline-tool--font',

  }
  nodes = {
    button: undefined
  }
  selectedFontSize = null;

  selectionList = undefined;

  buttonWrapperText = undefined;

  createSvg = undefined;

  make(tagName, classNames = null) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }
    return el;
  }

  createButton() {
    this.nodes.button = this.make('button', [this.CSS.button, this.CSS.buttonModifier]);
    this.nodes.button.type = 'button';
    this.nodes.button.setAttribute('id', 'fontSizeBtn');
    this.getFontSizeForButton();
    this.createSvg = this.svg('toggler-down', 13, 13);
    this.nodes.button.appendChild(this.createSvg);
  }
  getFontSizeForButton() {
    this.buttonWrapperText = this.make('div', 'button-wrapper-text');
    const displaySelectedFontSize = this.make('div');
    displaySelectedFontSize.setAttribute('id', this.fontSizeDropDown)
    displaySelectedFontSize.innerHTML = this.emptyString;
    this.buttonWrapperText.append(displaySelectedFontSize);
    this.nodes.button.append(this.buttonWrapperText);
  }

  addFontSizeOptions() {
    const fontSizeList = [
      { label: '10', value: '1' },
      { label: '13', value: '2' },
      { label: '16', value: '3' },
      { label: '18', value: '4' },
      { label: '24', value: '5' },
      { label: '32', value: '6' },
      { label: '48', value: '7' }
    ];
    this.selectionList = this.make('div', 'selectionList');
    const selectionListWrapper = this.make('div', 'selection-list-wrapper');

    for (const fontSize of fontSizeList) {
      const option = this.make('div');
      option.setAttribute('value', fontSize.value);
      option.setAttribute('id', fontSize.value);
      option.classList.add('selection-list-option');
      if ((document.getElementById(this.fontSizeDropDown).innerHTML === fontSize.label) || (this.selectedFontSize === fontSize.value)) {
        option.classList.add('selection-list-option-active');
      }
      option.innerHTML = fontSize.label;
      selectionListWrapper.append(option);
    }
    this.selectionList.append(selectionListWrapper);
    this.nodes.button.append(this.selectionList);
    this.selectionList.addEventListener('click', this.toggleFontSizeSelector);

    setTimeout(() => {
      if (typeof this.togglingCallback === 'function') {
        this.togglingCallback(true);
      }
    }, 50);
  };

  toggleFontSizeSelector = (event) => {
    this.selectedFontSize = event.target.id;
    this.toggle();
  }

  removeFontSizeOptions() {
    if (this.selectionList) {
      this.isDropDownOpen = false;
      this.selectionList = this.selectionList.remove();
    }
    if (typeof this.togglingCallback === 'function') {
      this.togglingCallback(false);
    }
  }

  render() {
    this.createButton();
    this.nodes.button.addEventListener('click', this.toggleDropDown);
    return this.nodes.button;
  }

  toggleDropDown = ($event) => {
    if ((($event.target).id === this.fontSizeDropDown || $event.target.parentNode.id === 'fontSizeBtn')) {
      this.toggle((toolbarOpened) => {
        if (toolbarOpened) {
          this.isDropDownOpen = true;
        }
      })
    }
  }

  toggle(togglingCallback) {
    if (!this.isDropDownOpen && togglingCallback) {
      this.addFontSizeOptions();
    } else {
      this.removeFontSizeOptions();
    }
    if (typeof togglingCallback === 'function') {
      this.togglingCallback = togglingCallback;
    }
  }

  surround(range) {
    if (this.selectedFontSize) {
      document.execCommand('fontSize', false, this.selectedFontSize);
    }
  }

  getComputedFontStyle(node) {
    return window.getComputedStyle(node.parentElement, null).getPropertyValue('font-size');
  };
  
  checkState(selection) {
    const isActive = document.queryCommandState('fontSize');
    let anchoredElementFontSize = this.getComputedFontStyle(selection.anchorNode);
    const focusedElementFontSize = this.getComputedFontStyle(selection.focusNode);
    if (anchoredElementFontSize === focusedElementFontSize) {
      anchoredElementFontSize = anchoredElementFontSize.slice(0, anchoredElementFontSize.indexOf('p'));
      const elementContainsDecimalValue = anchoredElementFontSize.indexOf('.');
      if (elementContainsDecimalValue !== -1) {
        anchoredElementFontSize = anchoredElementFontSize.slice(0, anchoredElementFontSize.indexOf('.'));
      }
      this.replaceFontSizeInWrapper(anchoredElementFontSize);
    }
    else {
      const emptyWrapper = this.emptyString;
      this.replaceFontSizeInWrapper(emptyWrapper);
    }
    return isActive;
  }

  replaceFontSizeInWrapper(size) {
    const displaySelectedFontSize = document.getElementById(this.fontSizeDropDown);
    displaySelectedFontSize.innerHTML = size;
  }

  clear() {
    this.toggle();
    this.selectedFontSize = null;
  }

  svg(name, width = 14, height = 14) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    icon.classList.add('icon', 'icon--' + name);
    icon.setAttribute('width', width + 'px');
    icon.setAttribute('height', height + 'px');
    icon.innerHTML = `<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${name}"></use>`;

    return icon;
  }
}
module.exports = FontSizeTool