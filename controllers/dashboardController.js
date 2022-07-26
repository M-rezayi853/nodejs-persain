const axios = require('axios')
const { validationResult } = require('express-validator')
let controller = require('./controller')
const User = require('../models/user')
const Payment = require('../models/payment')

class DashboardController extends controller {
  async index(req, res, next) {
    try {
      res.render('dashboard/index')
    } catch (err) {
      next(err)
    }
  }

  async edituser(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        let myErrors = errors.array().map((err) => err.msg)
        req.flash('errors', myErrors)
        return res.redirect('/dashboard')
      }

      let data = {
        name: req.body.name,
      }

      if (req.file) {
        data.img = req.file.path.replace(/\\/g, '/').substring(6)
      }

      await User.updateOne({ _id: req.user.id }, { $set: data })
      res.redirect('/dashboard')
    } catch (err) {
      next(err)
    }
  }

  async pay(req, res, next) {
    try {
      let params = {
        merchant_id: '6cded376-3063-11e9-a98e-005056a205be',
        amount: req.body.amount,
        callback_url: 'http://localhost:3000/paycallback',
        description: 'افزایش اعتبار حساب کاربری',
      }

      const { data } = await axios.post(
        'https://api.zarinpal.com/pg/v4/payment/request.json',
        params
      )

      if (data.data.code == 100) {
        let newPayment = new Payment({
          user: req.user.id,
          amount: req.body.amount,
          resnumber: data.data.authority,
        })

        await newPayment.save()
        res.redirect(
          `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`
        )
      } else {
        res.redirect('/dashboard')
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new DashboardController()
