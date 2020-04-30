const fs = require('fs');
const net = require('net');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Utils
function iterateObject(obj, level, callbackNonLeaf, callbackLeaf) {
  const keys = Object.keys(obj)
      .sort();
  for (let i = 0, l = keys.length; i < l; i += 1) {
    const key = keys[i];
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object'
          && obj[key] !== null
          && !Array.isArray(obj[key])
          && !(obj[key] instanceof Date)
          && !(obj[key] === 'function')) {
        callbackNonLeaf(key, level, obj[key]);
        iterateObject(obj[key], level + 1, callbackNonLeaf, callbackLeaf);
      } else {
        callbackLeaf(key, obj[key]);
      }
    }
  }
}

// Params
function getNodeArgs() {
  const args = {};
  process.argv
      .slice(2, process.argv.length)
      .forEach((arg) => {
        // long arg
        if (arg.slice(0, 2) === '--') {
          const longArg = arg.split('=');
          const longArgFlag = longArg[0].slice(2, longArg[0].length);
          args[longArgFlag] = longArg.length > 1 ? longArg[1] : true;
          // eslint-disable-next-line brace-style
        } else if (arg[0] === '-') {
          const flags = arg.slice(1, arg.length)
              .split('');
          flags.forEach((flag) => {
            args[flag] = true;
          });
        }
      });
  return args;
}

function getParam(array, param) {
  let paramValue = '';
  for (let i = 0, l = array.length; i < l; i += 1) {
    const paramArray = array[i].split('=');
    if (paramArray.length === 2 && paramArray[0] === param) {
      // eslint-disable-next-line prefer-destructuring
      paramValue = paramArray[1];
    }
  }
  return paramValue;
}

// Files
function writeDataToFile(fileDirName, data) {
  fs.writeFile(fileDirName, data, (err) => {
    // eslint-disable-next-line no-console
    console.log(`${fileDirName}: ${err ? 'Write File failed!' : 'Saved successfully!'}`);
  });
}

function readDataFromFile(fileDirname) {
  return fs.readFileSync(fileDirname)
      .toString();
}

function getFileStats(fileDirName) {
  return fs.statSync(fileDirName);
// stats
// {
//  dev : 0 ,
//  mode : 33206 ,
//  nlink : 1 ,
//  uid : 0 ,
//  gid : 0 ,
//  rdev : 0 ,
//  ino : 0 ,
//  size : 378(字节) ,
//  atime : Tue Jun 10 2014 13:57:13 GMT +0800 <中国标准时间> ,
//  mtime : Tue Jun 13 2014 09:48:31 GMT +0800 <中国标准时间> ,
//  ctime : Tue Jun 10 2014 13:57:13 GMT +0800 <中国标准时间>
// }
// stat.isFile()
// stat.isDirectory()
}

function getNameFromFileName(fileName) {
  return fileName.slice(0, fileName.lastIndexOf('.'));
}

// Directory
function getDirectoryList(directory) {
  const dirContent = {
    dirNames: [],
    fileNames: [],
  };
  fs.readdirSync(directory)
      .forEach((dirItem) => {
        if (fs.statSync(`${directory}/${dirItem}`)
            .isDirectory()) {
          dirContent.dirNames[dirContent.dirNames.length] = dirItem;
        } else {
          dirContent.fileNames[dirContent.fileNames.length] = dirItem;
        }
      });
  return dirContent;
}

function getDirectoryFileNames(dirPath) {
  return getDirectoryList(dirPath).fileNames;
}

function getDirectoryFolderNames(dirPath) {
  return getDirectoryList(dirPath).dirNames;
}

function getDiffFolderFileNames(sourceFolder, destFolder) {
  const sourceFileNames = getDirectoryFileNames(sourceFolder);
  const destFileNames = getDirectoryFileNames(destFolder);
  const destFileMap = {};
  const resultFileNames = [];
  for (let i = 0; i < destFileNames.length; i += 1) {
    destFileMap[getNameFromFileName(destFileNames[i])] = destFileNames[i];
  }
  for (let i = 0; i < sourceFileNames.length; i += 1) {
    if (!destFileMap[getNameFromFileName(sourceFileNames[i])]) {
      resultFileNames.push(sourceFileNames[i]);
    }
  }
  return resultFileNames;
}

function readDirectory(fileDir, fileCallback, folderCallback) {
  fs.stat(fileDir, (error, stats) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('获取文件stats失败');
    } else if (stats.isFile()) {
      if (fileCallback) {
        fileCallback(fileDir, stats);
      }
    } else if (stats.isDirectory()) {
      if (folderCallback) {
        folderCallback(fileDir);
      }
      // eslint-disable-next-line no-use-before-define
      getFileFromDirectory(fileDir, fileCallback, folderCallback); // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
    }
  });
}

function getFileFromDirectory(filePath, fileCallback, folderCallback) {
  // 根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, (err, files) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    } else {
      // 遍历读取到的文件列表
      files.forEach((filename) => {
        // 获取当前文件的绝对路径
        const fileDir = path.join(filePath, filename);
        // 根据文件路径获取文件信息，返回一个fs.Stats对象
        readDirectory(fileDir, fileCallback, folderCallback);
      });
    }
  });
}

// Webpack
const setMPA = (entryDir = './src/*/index.js', entryRegexp = /src\/(.*)\/index\.js/) => {
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

const checkServerPort = (port = 3000, hostname = 'localhost') => {
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


module.exports = {
  // Utils
  iterateObject,

  // Params
  getNodeArgs,
  getParam,

  // Files
  writeDataToFile,
  readDataFromFile,
  getFileStats,
  getNameFromFileName,

  // Directory
  getDirectoryList,
  getDirectoryFileNames,
  getDirectoryFolderNames,
  getDiffFolderFileNames,
  getFileFromDirectory,
  readDirectory,

  // Webpack
  setMPA,
  checkServerPort,
};
