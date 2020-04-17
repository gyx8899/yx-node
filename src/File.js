const fs = require('fs');

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

module.exports = {
  writeDataToFile,
  readDataFromFile,
  getFileStats,
  getNameFromFileName,
};
