import { Plugins } from './Plugin';

export function Editor() {
  this.plugins = new Plugins(this);
  this.three = {};
}

Editor.prototype = {
  use: function(plugin, options = {}) {
    this.plugins.add(plugin, options);
  },
};
