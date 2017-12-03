var App = require('ghost-app');
var marked = require('marked');
var escapeRegExp = require('escape-string-regexp');

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
  var section = null,
      sectionHeader = "<!-- " + sectionID + ":",
      sectionFooter = sectionID + "-->";

  for (line of content.split("\n")){
    if(section == null){
      if(line.startsWith(sectionHeader)) {
        if(line.endsWith("-->")){
          var key = escapeRegExp(sectionID)
              exp = new RegExp("^<!--\\s*(?:" + key + "):\\s*(.+?)\\s*-->$"),
            match = exp.exec(line);

          return (match == null) ? "<script>console.log(JSON.parse('"+JSON.stringify({
            line:line,
            exp:exp,
            match:match,
            key:key,
            sectionID: sectionID
          })+"'))</script>" : match[1];
        }
        section = [];
      }
    } else {
      if(line.startsWith(sectionFooter)){
        return marked(section.join("\n"));
      } else {
        section.push(line);
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
