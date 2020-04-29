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
exports.iterateObject = iterateObject;

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
exports.getNodeArgs = getNodeArgs;

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
exports.getParam = getParam;
