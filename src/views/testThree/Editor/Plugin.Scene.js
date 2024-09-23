function ScenePlugin(editor, options) {
  function install(editor, options) {
    editor.three.scene = new THREE.Scene();
  }

  function uninstall(editor, options) {
    editor.three.scene = null;
  }

  return {
    install,
    uninstall,
  };
}

export { ScenePlugin };
