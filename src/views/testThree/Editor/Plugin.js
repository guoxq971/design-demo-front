function Plugins(editor) {
  this.editor = editor;
  this.plugins = [];

  this.add = function(plugin, options) {
    const { install, uninstall } = plugin();
    install(editor, options);
    this.plugins.push({ install, uninstall });

    return this.editor;
  };
}

export { Plugins };
