function DemoPlugin(editor, options) {
  function install(editor, options) {
    console.log('demo plugin');
  }

  function uninstall(editor, options) {}

  return {
    install,
    uninstall,
  };
}

export { DemoPlugin };
