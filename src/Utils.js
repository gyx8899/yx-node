function iterateObject(obj, level, callbackNonLeaf, callbackLeaf) {
  const keys = Object.keys(obj).sort();
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
      } else callbackLeaf(key, obj[key]);
    }
  }
}


module.exports = {
  iterateObject,
};
