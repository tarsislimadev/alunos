const moment = require('moment')
moment.locale('pt-br')

/**
 * @param {string} date
 */
exports.br2en = function br2en (date) {
  return date.split('/').reverse().join('-')
}

/**
 * @param {string} date
 */
exports.en2br = function en2br (date) {
  return date.split('-').reverse().join('/')
}

/**
 * @param {string|Date} date
 */
exports.to_br = function to_br (date) {
  return moment(date).format('L')
}

/**
 * @param {Date|Moment} date
 */
exports.to_en = function to_en (date) {
  if (moment.isMoment(date)) date = date.toDate()
  return date.toJSON().toString().split('T')[0]
}

/**
 * @returns {string}
 */
exports.today = function today () {
  return exports.to_en(new Date())
}
