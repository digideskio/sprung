var Draggabilly = require('draggabilly');

module.exports = {
  bind: function() {
    var self = this;
    if (Object.keys(self.vm.notebook).length > 0) {
      // make it draggable
      var draggie = new Draggabilly(self.el);
      draggie
        .on('staticClick',
          function(ev) {
            self.vm.modalMe(self.vm);
          })
        .on('dragEnd',
          function(ev) {
            // TODO: save position to notebook
            self.vm.notebook.positions[self.vm.doc._id] = [draggie.position.x + 'px', draggie.position.y + 'px'];
            self.vm.$db.put(self.vm.notebook)
              .then(function(resp) {
                // TODO: confirm saving; handle errors
              });
          });
        console.log('logged in?', self.vm.$root.loggedIn);
      if (self.vm.$root.loggedIn) {
        draggie.enable();
      } else {
        draggie.disable();
      }
      // add stored position info to card
      if (undefined === self.vm.notebook.positions) {
        self.vm.notebook.positions = {};
      }
      if (self.vm.notebook.positions &&
          self.vm.notebook.positions[self.vm.doc._id]) {
        var left = self.vm.notebook.positions[self.vm.doc._id][0];
        var top = self.vm.notebook.positions[self.vm.doc._id][1];
        self.el.style.left = left;
        self.el.style.top = top;
        self.el.style.position = 'absolute';
      }
    } else {
      self.el.addEventListener('click', function() {
        self.vm.modalMe(self.vm);
      });
    }
  }
};
