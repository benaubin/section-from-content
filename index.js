var App = require('ghost-app');

var marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

var sectionFromContent = function(sectionID, content){
  var section = null;

  for (line of content.split("\n")){
    if(section == null){
      if(line.startsWith("<!-- " + sectionID + ":")) {
        section = "";
      }
    } else {
      if(line.startsWith(sectionID + "-->")){
        return marked(section);
      } else {
        section += line + "\n";
      }
    }
  }
}


var sectionFromContentApp = App.extend({
    install: function() {},

    uninstall: function() {},

    activate: function() {
        this.app.helpers.register('sectionFromContent', this.sectionFromContentHelper)
    },

    deactivate: function() {},

    sectionFromContentHelper(section, content) {
      return sectionFromContent(section, content);
    }
});

module.exports = sectionFromContentApp;
