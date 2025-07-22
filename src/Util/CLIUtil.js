const Readline = require('readline');

module.exports = class CLIUtil {

  /**
   * Parses CLI options and returns positional arguments until the first "--option"
   * @param {string[]} params - Typically process.argv.slice(2)
   * @returns {{ options: Object, args: string[] }}
   */
  static getParseOptions(params = null) {
    params ??= process.argv.slice(2);
    const options = {};
    const args = [];

    let i = 0;
    let foundOption = false;

    while (i < params.length) {
      const arg = params[i];

      if (!foundOption && !arg.startsWith('--')) {
        args.push(arg);
        i++;
        continue;
      }

      foundOption = true;

      if (arg.startsWith('--')) {
        const key = arg.slice(2);
        const next = params[i + 1];

        if (!next || next.startsWith('--')) {
          options[key] = true;
          i++;
        } else {
          options[key] = next;
          i += 2;
        }
      } else {
        i++;
      }
    }

    return { options, args };
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