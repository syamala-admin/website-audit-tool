'use strict';

/**
 * Strategy pattern: common interface every concrete audit check must implement.
 * `run(context)` returns an array of findings shaped as:
 * { id, category, severity, description, fix }
 */
class Check {
  // eslint-disable-next-line no-unused-vars
  run(context) {
    throw new Error('Check.run() must be implemented by subclasses');
  }
}

module.exports = Check;
