const messages = require('../config').messages

exports.error = function (err, message = messages.errorMessage) {
  console.error(err)
  return {
    success: false,
    message
  }
}

exports.success = function (result = {}) {
  return {
    success: true,
    message: null,
    ...result
  }
}
