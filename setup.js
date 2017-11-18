var APPS_TO_INSTALL = ["section-from-content"];

// install or remove
var action = "install";

// don't change the following

var _ = require('lodash');
var Promise = require('bluebird');

var settingsCache = require("../../../current/core/server/settings/cache");
var config = require("../../../current/core/server/config");
var api = require("../../../current/core/server/api");
var server = require("../../../current/core/server");

var installApps = function(activeApps){
  return _.uniq(APPS_TO_INSTALL.concat(activeApps))
};
installApps.alreadyMsg = "Apps already active."
installApps.successMsg = "Activated apps. Restart ghost to see changes."

var removeApps = function(activeApps){
  return _.difference(activeApps, APPS_TO_INSTALL)
};
removeApps.alreadyMsg = "Apps already removed."
removeApps.successMsg = "Removed apps. Restart ghost to see changes."

var actions = {
  remove: removeApps,
  install: installApps
}

action = actions[action];

// based on https://github.com/TryGhost/Ghost/blob/master/core/server/services/apps/index.js

// initalize ghost
server().then(function(){
  // get the active apps
  return settingsCache.get('active_apps');
}).then(function(activeApps){
  // remove internal apps.
  var prevActiveApps = _.difference(activeApps, config.get('apps:internal'));

  // apply the action above to the previous active apps
  var newActiveApps = action(prevActiveApps);

  if (!(newActiveApps.length === 0 && prevActiveApps.length !== 0) && _.difference(newActiveApps, prevActiveApps).length === 0) {
      console.log(action.alreadyMsg);
      console.log("  Active apps: " + activeApps.join(", "));
      throw "fail";
  }

  return api.settings.edit({settings: [{key: 'active_apps', value: newActiveApps}]}, {context: {internal: true}});
}).then(function(data){
  console.log("Success.", action.successMsg);
}).finally(function(){
  process.exit();
});
