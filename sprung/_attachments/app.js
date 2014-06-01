var Fetchable = Vue.extend({
  methods: {
    fetchData: function () {
      if (!this.apiUrl) return false;
      var xhr = new XMLHttpRequest(),
          self = this;
      xhr.open('GET', self.apiUrl);
      xhr.onload = function () {
        self.items = JSON.parse(xhr.responseText);
      };
      xhr.send();
    }
  },
  created: function() {
    this.$watch('apiUrl', function() {
      this.fetchData();
    });
  }
});

Vue.component('thing-notebook-list', Fetchable.extend({
  data: {
    apiUrl: '_view/notebooks?reduce=false'
  }
}));

Vue.component('thing-type-list', {
  data: {
    notebook: false,
    types: []
  },
  computed: {
    apiUrl: function() {
      if (this.notebook) {
        return '_view/by_notebook?group_level=2&startkey=["' + this.notebook
          + '"]&endkey=["' + this.notebook + '", {}]';
      } else {
        return '_view/by_type?group_level=1';
      }
    }
  },
  created: function() {
    this.$watch('notebook', function() {
      this.fetchData();
    });
  },
  methods: {
    fetchData: function () {
      if (!this.apiUrl) return false;
      var xhr = new XMLHttpRequest(),
          self = this;
      xhr.open('GET', self.apiUrl);
      xhr.onload = function () {
        self.items = JSON.parse(xhr.responseText);
        self.types = [];
        if (self.notebook) {
          for (var i = 0; i < self.items.rows.length; i++) {
            // if there are 2 keys, we have a type entry
            if (self.items.rows[i].key.length === 2) {
              self.types.push({"type": self.items.rows[i].key[1],
                "count": self.items.rows[i].value});
            }
          }
        } else {
          for (var i = 0; i < self.items.rows.length; i++) {
            self.types.push({"type": self.items.rows[i].key[0],
              "count": self.items.rows[i].value});
          }
        }
      };
      xhr.send();
    }
  },
});

Vue.component('thing-list', Fetchable.extend({
  data: {
    notebook: false,
    type: 'Book'
  },
  computed: {
    apiUrl: function() {
      if (this.notebook) {
        return '_view/by_notebook?reduce=false'
          + '&startkey=["' + this.notebook + '", "' + this.type + '"]'
          + '&endkey=["' + this.notebook + '", "' + this.type + '", {}]'
          + '&include_docs=true';
      }
      return '_view/by_type?startkey=["' + this.type + '"]&endkey=["' +
        this.type + '",{}]&reduce=false&include_docs=true';
    }
  },
  created: function() {
    this.$watch('type', function() {
      this.fetchData();
    });
  }
}));
var app = new Vue({
  el: 'body',
  data: {
    current: {
      notebook: false,
      type: 'Task'
    }
  }
});
