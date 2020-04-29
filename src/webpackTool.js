const net = require('net');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');

exports.setMPA = (entryDir = './src/*/index.js', entryRegexp = /src\/(.*)\/index\.js/) => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, entryDir));

  Object.keys(entryFiles)
      .map((index) => {
        const entryFile = entryFiles[index];
        // '/Users/cpselvis/my-project/src/index/index.js'

        const match = entryFile.match(entryRegexp);
        const pageName = match && match[1];

        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
              template: path.join(__dirname, `src/${pageName}/index.html`),
              filename: `${pageName}.html`,
              chunks: [pageName],
              inject: true,
              minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false,
              },
            }),
        );
      });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

exports.checkServerPort = (port = 3000, hostname = 'localhost') => {
  const server = net.createServer().listen(port, hostname);
  return new Promise((resolve) => {
    server.on('listening', () => {
      server.close();
      resolve(port);
    });
    server.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.log('Error: (checkServerPort) ', err);
      // TODO: would you like open the app on another port instead
      resolve(port + 1);
    });
  });
};
