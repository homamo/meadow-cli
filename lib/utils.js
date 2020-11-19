function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pluralize(s) {
  if (typeof s !== 'string') return '';
  return `${s}s`;
}

module.exports = { capitalize, pluralize };
