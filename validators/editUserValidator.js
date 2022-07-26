const validator = require('./validator')
const { check } = require('express-validator')
const path = require('path')

class EditUserValidator extends validator {
  handle() {
    return [
      check('name', 'نام نمی تواند خالی باشد').not().isEmpty(),
      check('img', 'وجود تصویر الزامیست').not().isEmpty(),
      check('img').custom(async (value) => {
        if (!['.jpg', '.jpeg', '.png'].includes(path.extname(value))) {
          if (!value) {
            return
          }
          throw new Error('پسوند فایل اپلود شده صحیح نیست')
        }
      }),
    ]
  }
}

module.exports = new EditUserValidator()
