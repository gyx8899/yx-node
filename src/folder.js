const fs = require('fs');
const path = require('path');
const {getName} = require('./file');

// Directory
function getList(directory) {
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
exports.getList = getList;

function getFileNames(dirPath) {
  return getList(dirPath).fileNames;
}
exports.getFileNames = getFileNames;

function getNames(dirPath) {
  return getList(dirPath).dirNames;
}
exports.getNames = getNames;

function getDiffFileNames(sourceFolder, destFolder) {
  const sourceFileNames = getFileNames(sourceFolder);
  const destFileNames = getFileNames(destFolder);
  const destFileMap = {};
  const resultFileNames = [];
  for (let i = 0; i < destFileNames.length; i += 1) {
    destFileMap[getName(destFileNames[i])] = destFileNames[i];
  }
  for (let i = 0; i < sourceFileNames.length; i += 1) {
    if (!destFileMap[getName(sourceFileNames[i])]) {
      resultFileNames.push(sourceFileNames[i]);
    }
  }
  return resultFileNames;
}
exports.getDiffFileNames = getDiffFileNames;

function getFileStatsWithCallback(fileDir, fileCallback, folderCallback) {
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
      // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
      // eslint-disable-next-line no-use-before-define
      getFolderFileStatsWithCallback(fileDir, fileCallback, folderCallback);
    }
  });
}
exports.getFileStatsWithCallback = getFileStatsWithCallback;

function getFolderFileStatsWithCallback(filePath, fileCallback, folderCallback) {
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
        getFileStatsWithCallback(fileDir, fileCallback, folderCallback);
      });
    }
  });
}
exports.getFolderFileStatsWithCallback = getFolderFileStatsWithCallback;
