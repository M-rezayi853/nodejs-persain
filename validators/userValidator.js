const validator = require('./validator')
const { check } = require('express-validator')

class UserValidator extends validator {
  handle() {
    return [
      check('email', 'فرمت ایمیل صحیح نیست').isEmail(),
      check('password', 'طول پسورد بایستی حداقل 5 کاراکتر باشد').isLength({
        min: 5,
      }),
    ]
  }
}

module.exports = new UserValidator()
