const axios = require('axios')
let controller = require('./controller')
const { validationResult } = require('express-validator')
const User = require('../models/user')
const Payment = require('../models/payment')

class HomeController extends controller {
  async paycallback(req, res, next) {
    try {
      if (req.query.Status && req.query.Status === 'NOK') {
        return res.send('تراکنش ناموفق')
      }

      let payment = await Payment.findOne({ resnumber: req.query.Authority })
      if (!payment) return res.send('همچین تراکنشی وجود ندارد')

      let params = {
        merchant_id: '6cded376-3063-11e9-a98e-005056a205be',
        amount: payment.amount,
        Authority: req.query.Authority,
      }
      const { data } = await axios.post(
        'https://api.zarinpal.com/pg/v4/payment/verify.json',
        params
      )

      if (data.data.code == 100) {
        let balance = payment.amount
        let user = await User.findById(payment.user)
        if (user.balance) {
          balance += user.balance
        }
        user.balance = balance
        payment.payment = true
        await user.save()
        await payment.save()

        res.redirect('/dashboard')
      } else {
        return res.send('تراکنش ناموفق بوده است')
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new HomeController()
