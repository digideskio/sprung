var PouchDB = require('pouchdb');

// TODO: move this to a config lib
var db_name = location.pathname.split('/')[1];
var db_url = location.protocol + '//' + location.hostname
    + (location.port ? ':' + location.port : '') + '/' + db_name + '/';
var db = new PouchDB(db_url);

var default_data = {
  active: false,
  name: 'JSON',
  schema_url: '',
  doc: {}
};

module.exports = {
  data: function() {
    return default_data;
  },
  components: {
    // TODO: make these dynamic...somehow
    'json': require('../json-editor'),
    'vue-schema': require('../vue-schema')
  },
  replace: true,
  template: require('./template.html'),
  computed: {
    name: function() {
      // TODO: make this smarter
      if (this.doc.type) {
        return this.doc.type;
      }
    },
    editor: function() {
      if (this.schema_url) {
        return 'vue-schema';
      } else if (this.doc.type && undefined != this.$root.types[this.doc.type]
          && undefined != this.$root.types[this.doc.type].editor) {
        return this.$root.types[this.doc.type].editor;
      } else {
        return 'json';
      }
    }
  },
  methods: {
    destroy: function() {
      this.$destroy(true);
    },
    save: function() {
      var self = this;
      // get doc from editor
      var doc = this.$.editor.output();
      // save doc
      db.post(doc, function(err, resp) {
        if (err) {
          // TODO: maybe tell somebody...
          console.log('error: ', err);
        } else {
          // TODO: trigger content reload, etc.
          self.destroy();
        }
      });
    }
  }
};
