const validator = require('./validator')
const { check } = require('express-validator')

class AuthValidator extends validator {
  register() {
    return [
      check('name', 'نام نمی تواند خالی باشد').not().isEmpty(),
      check('email', 'فرمت ایمیل صحیح نیست').isEmail(),
      check('password', 'طول پسورد بایستی حداقل 5 کاراکتر باشد').isLength({
        min: 5,
      }),
    ]
  }

  login() {
    return [
      check('email', 'فرمت ایمیل صحیح نیست').isEmail(),
      check('password', 'طول پسورد بایستی حداقل 5 کاراکتر باشد').isLength({
        min: 5,
      }),
    ]
  }
}

module.exports = new AuthValidator()
