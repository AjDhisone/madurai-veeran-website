(function () {
  var root = document.documentElement;
  var classPrefix = " w-mod-";
  root.className += classPrefix + "js";
  if ("ontouchstart" in window || (window.DocumentTouch && document instanceof DocumentTouch)) {
    root.className += classPrefix + "touch";
  }
})();

var swipers = {};

document.addEventListener("DOMContentLoaded", function () {
  (function () {
    var repository = "https://cdn.jsdelivr.net/gh/Course-Studio/sophia-amoruso@";
    var version = "0.20";
    var basePath = repository + version + "/dist/";

    function loadScript(src, callback) {
      var script = document.createElement("script");
      script.src = src;
      script.defer = true;
      if (callback) {
        script.onload = callback;
      }
      document.body.appendChild(script);
    }

    window.loadPageScript = function (pageScriptName) {
      loadScript(basePath + pageScriptName);
    };

    loadScript(basePath + "index.js", function () {
      loadScript(basePath + "pageload.js", function () {
        window.loadPageScript("homepage.js");
      });
    });
  })();
});
