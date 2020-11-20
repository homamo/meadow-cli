const capitalize = require('./capitalize');

function splitKebabTextIntoCases(kebabText) {
  const words = kebabText.split('-');
  const lower = words.join(' ').toLowerCase();
  const upper = lower.toUpperCase();
  const title = words.map((w) => capitalize(w)).join(' ');
  const sentence = capitalize(lower);
  const pascal = title.replace(/ /g, '');
  const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);

  return {
    kebab: kebabText,
    lower,
    upper,
    camel,
    pascal,
    sentence,
    title,
  };
}

module.exports = splitKebabTextIntoCases;
