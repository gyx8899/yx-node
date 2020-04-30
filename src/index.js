exports.yxFile = require('./file');

exports.yxFolder = require('./folder');

exports.yxWebpack = require('./webpack');

exports.yxUtil = require('./util');

// Below is just downward compatibility for "@daybyday/yx-node": "^0.1.4",
const {readData, writeData} = require('./file');
const {iterateObject, getNodeArgs} = require('./util');
const {getDiffFileNames} = require('./folder');

exports.readDataFromFile = readData;
exports.writeDataToFile = writeData;
exports.iterateObject = iterateObject;
exports.getNodeArgs = getNodeArgs;
exports.getDiffFolderFileNames = getDiffFileNames;
