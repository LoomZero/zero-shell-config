const Readline = require('readline');

module.exports = class CLIUtil {

  /**
   * Parses CLI arguments like "--branch prod --prod"
   * @param {string[]} args - Array of arguments (usually process.argv.slice(2))
   * @returns {Object} Parsed key-value pairs
   */
  static getParseOptions(args = null) {
    args ??= process.argv.slice(2);
    const result = {};
    let i = 0;

    while (i < args.length) {
      const arg = args[i];

      if (arg.startsWith('--')) {
        const key = arg.replace(/^--/, '');

        const next = args[i + 1];
        if (!next || next.startsWith('--')) {
          // Flag (e.g. --prod)
          result[key] = true;
          i++;
        } else {
          // Option with value (e.g. --branch prod)
          result[key] = next;
          i += 2;
        }
      } else {
        i++;
      }
    }

    return result;
  }

  static async ask(question) {
    const rl = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(`${question}: `, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

}