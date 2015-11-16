var prefix, hiddenProperty,
  supportsVisibilityApi = false,
  document = window.document,
  prefixes = ["", "ms", "moz", "webkit"];

while (prefixes.length) {
  prefix = prefixes.pop();
  hiddenProperty = prefix ? prefix + "Hidden" : "hidden";

  if (hiddenProperty in document) {
    supportsVisibilityApi = true;
    break;
  }
}

if (supportsVisibilityApi && prefix !== '') {
  // If we're dealing with a prefixed version of the API, then
  // normalize it so that we can use the same API across browsers.
  $.event.special.visibilitychange = {
    bindType: prefix + "visibilitychange"
  };

  Object.defineProperty(document, "hidden", {
    get: function () {
      return document[hiddenProperty];
    }
  });

  Object.defineProperty(document, "visibilityState", {
    get: function () {
      return document[prefix + "VisibilityState"];
    }
  });
}
