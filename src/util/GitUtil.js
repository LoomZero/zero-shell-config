const { execSync } = require('child_process');

module.exports = class GitUtil {

  static getCurrentBranch(path = null) {
    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', {
        cwd: path ?? process.cwd(),
        encoding: 'utf-8',
      });
      return branch.trim();
    } catch (err) {
      console.error('Failed to determine current Git branch:', err.message);
      return null;
    }
  }

  static getParseBranch(branch = null) {
    branch ??= this.getCurrentBranch();
    const result = {
      category: null,
      id: null,
      suffix: null,
    };

    if (!branch || typeof branch !== 'string') return result;

    const parts = branch.split('/');
    result.category = parts[0] || null;

    if (parts.length > 1) {
      const rest = parts.slice(1).join('/');
      const match = rest.match(/^(\d+)-(.+)$/);

      if (match) {
        result.id = match[1];
        result.suffix = match[2];
      } else {
        result.suffix = rest;
      }
    }

    return result;
  }

}