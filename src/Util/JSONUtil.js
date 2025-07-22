module.exports = class JSONUtil {

  /**
   * @param {Object} data
   * @param {string} name
   * @param {any} fallback
   * @returns {any}
   */
  static getDeep(data, name, fallback = null) {
    const splits = name.split('.');

    for (const split of splits) {
      if (data === undefined) return fallback;
      data = data[split];
    }
    return (data === undefined ? fallback : data);
  }

  /**
   * @param {Object} data
   * @param {string} name
   * @returns {boolean}
   */
  static hasDeep(data, name) {
    const splits = name.split('.');

    for (const split of splits) {
      if (data === undefined) return false;
      data = data[split];
    }
    return (data === undefined ? false : true);
  }

  /**
   * @param {Object} data
   * @param {string} name
   * @param {any} value
   */
  static setDeep(data, name, value) {
    const splits = name.split('.');
    const last = splits.pop();

    for (const split of splits) {
      if (data[split] === undefined) data[split] = {};
      data = data[split];
    }
    data[last] = value;
  }

  /**
   * @param {Object} data
   * @param {string} name
   */
  static removeDeep(data, name) {
    const splits = name.split('.');
    const last = splits.pop();

    for (const split of splits) {
      if (data[split] === undefined) data[split] = {};
      data = data[split];
    }
    delete data[last];
  }

  /**
   * @param {Object} data
   * @param {string} name
   */
  static removeDeepRecursive(data, name) {
    const original = data;
    const splits = name.split('.');
    const last = splits.pop();

    for (const split of splits) {
      if (data[split] === undefined) data[split] = {};
      data = data[split];
    }
    delete data[last];

    if (Object.keys(data).length === 0 && splits.length) {
      this.removeDeepRecursive(original, splits.join('.'));
    }
  }

}