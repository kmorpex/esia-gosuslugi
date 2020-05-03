const leftPad = (value) => {
  const pad = value < 10 ? '0' : '';
  return pad + value;
};

/**
 * Формирование timestamp в формате, требуемом
 * документацией ЕСИА.
 *
 * @return {String} Timestamp
 */
module.exports = () => {
  const now = new Date();
  const Y = now.getFullYear();
  const M = leftPad(now.getMonth() + 1); // because 0 is January
  const D = leftPad(now.getDate());
  const h = leftPad(now.getHours());
  const m = leftPad(now.getMinutes());
  const s = leftPad(now.getSeconds());
  const Z = now.toString().match(/GMT(.{5})/)[1];

  return `${Y}.${M}.${D} ${h}:${m}:${s} ${Z}`;
};
