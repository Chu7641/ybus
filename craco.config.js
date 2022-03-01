const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#16bc8c',
              '@link-color': '#16bc8c',
              '@processing-color': '#4742bd',
              '@border-radius-base': '5px',
              '@input-hover-border-color': '#16bc8c',
              '@tag-default-color': '#16bc8c',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};