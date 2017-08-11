import jsdom from 'jsdom';

const { JSDOM } = jsdom;

if (typeof document === 'undefined') {
  var _dom = new JSDOM('<!doctype html><html><body>	<meta id="context-root" value="" /> </body></html>');
  global.window = _dom.window;
  global.document = window.document;
  global.navigator = window.navigator;

  // for react-slick media query issue
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener: function () { },
      removeListener: function () { }
    };
  };
}
