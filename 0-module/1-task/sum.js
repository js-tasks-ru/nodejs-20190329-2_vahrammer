/**
 * Returns a sum of arguments.
 * @param {number} a
 * @param {number} b
 * @return {*}
 */
function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be of type Integer.');
  }
  return a + b;
}

module.exports = sum;
