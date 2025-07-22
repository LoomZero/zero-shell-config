const FS = require('fs');
const Path = require('path');
const OS = require('os');
const JSONUtil = require('./Util/JSONUtil');
const CLIUtil = require('./Util/CLIUtil');

module.exports = class LoomConfig {

  constructor() {
    const parse = CLIUtil.getParseOptions();
    this.private = {};
    this.config = {};
    this.args = parse.args;
    this.options = parse.options;
    this.path = null;
  }

  /**
   * @param {string} namespace 
   * @param {string[]} tokens 
   * @param {function} setup 
   * @returns {this}
   */
  async setup(namespace, tokens, setup = null) {
    if (setup === null) setup = () => {};
    const configPath = Path.join(OS.homedir(), 'loom.config.json');
    let config = {};

    if (FS.existsSync(configPath)) {
      try {
        config = JSON.parse(FS.readFileSync(configPath, 'utf-8'));
      } catch (err) {
        console.warn(`Error by parsing ${configPath}:`, err.message);
      }
    }

    let missing = [];
    if (!config[namespace]) {
      missing = tokens;
    } else {
      missing = tokens.filter(token => !JSONUtil.hasDeep(config, namespace + '.' + token));
    }

    if (missing.length > 0) {
      config[namespace] ??= {};
      console.log(`Config "${namespace}" incomplete, start setup ...`);
      await setup(config[namespace], missing, (key, value) => {
        JSONUtil.setDeep(config, namespace + '.' + key, value);
      });

      try {
        FS.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
        console.log(`Update config: ${configPath}`);
      } catch (err) {
        console.error(`Error by writing file ${configPath}: ${err.message}`);
      }
    }

    this.private = config;
    return this;
  }

  /**
   * @param {string} dir 
   * @returns {this}
   */
  load(dir = null) {
    if (!dir) dir = process.cwd();

    const file = Path.join(dir, 'composer.json');

    if (FS.existsSync(file)) {
      try {
        const data = JSON.parse(FS.readFileSync(file, 'utf-8'));
        if (data.extra && data.extra.loom) {
          this.config = data.extra.loom;
          this.path = file;
          return this;
        }
      } catch (err) {
        console.warn(`Error by parsing ${file}:`, err.message);
      }
    }

    const parent = Path.dirname(dir);
    if (parent !== dir) {
      this.load(parent);
    } else {
      console.warn(`WARN: No composer.json found with key "extra.loom".`);
    }
    return this;
  }

  /**
   * @param {string[]} keys 
   */
  check(keys = []) {
    for (const key of keys) {
      if (!JSONUtil.hasDeep(this, key)) {
        throw new Error('The key ' + key + ' is not defined.');
      }
    }
  }

}
