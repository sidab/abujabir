cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "es6-promise-plugin.Promise",
    "file": "plugins/es6-promise-plugin/www/promise.js",
    "pluginId": "es6-promise-plugin",
    "runs": true
  },
  {
    "id": "cordova-plugin-x-socialsharing.SocialSharing",
    "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
    "pluginId": "cordova-plugin-x-socialsharing",
    "clobbers": [
      "window.plugins.socialsharing"
    ]
  },
  {
    "id": "cordova-plugin-deeplinks.universalLinks",
    "file": "plugins/cordova-plugin-deeplinks/www/universal_links.js",
    "pluginId": "cordova-plugin-deeplinks",
    "clobbers": [
      "universalLinks"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-background-audio": "1.0.0",
  "cordova-plugin-build-architecture": "1.0.6",
  "cordova-plugin-splashscreen": "5.0.2",
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-crosswalk-webview": "2.4.0",
  "cordova-build-architecture": "1.0.4",
  "es6-promise-plugin": "4.2.2",
  "cordova-plugin-x-socialsharing": "5.4.7",
  "cordova-plugin-deeplinks": "1.1.1"
};
// BOTTOM OF METADATA
});