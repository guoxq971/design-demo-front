const path = require('path');
const resolve = (dir) => {
  return path.join(__dirname, dir);
};
module.exports = {
  devServer: {
    hot: true,
    disableHostCheck: true,
    port: 7000,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: 'http://gateway.fnconsumertest.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  lintOnSave: false,
};
