const axios = require('axios')
let controller = require('./controller')
const User = require('../models/user')
const Payment = require('../models/payment')

class HomeController extends controller {
  // async paycallback(req, res, next) {
  //   try {
  //     if (req.query.Status && req.query.Status !== 'OK') {
  //       return res.send('تراکنش ناموفق')
  //     }
  //     let payment = await Payment.findOne({ resnumber: req.query.Authority })
  //     if (!payment) return res.send('همچین تراکنشی وجود ندارد')
  //     let params = {
  //       MerchantID: '6cded376-3063-11e9-a98e-005056a205be',
  //       Amount: payment.amount,
  //       Authority: req.query.Authority,
  //     }

  //     const response = await axios.post(
  //       'https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json',
  //       params
  //     )

  //     console.log(response)

  //     if (response.data.Status == 100) {
  //       let balance = payment.amount
  //       let user = await User.findById(payment.user)
  //       if (user.balance) {
  //         balance += user.balance
  //       }
  //       user.balance = balance
  //       payment.payment = true
  //       await user.save()
  //       await payment.save()
  //       res.redirect('/dashboard')
  //     } else {
  //       return res.send('تراکنش ناموفق بود')
  //     }
  //   } catch (err) {
  //     next(err)
  //   }
  // }

  async paycallback(req, res, next) {
    try {
      if (req.query.Status && req.query.Status === 'NOK') {
        return res.send('تراکنش ناموفق')
      }

      let payment = await Payment.findOne({ resnumber: req.query.Authority })
      if (!payment) return res.send('همچین تراکنشی وجود ندارد')

      let params = {
        merchant_id: '6cded376-3063-11e9-a98e-005056a205be',
        authority: req.query.Authority,
        amount: payment.amount,
      }
      const { data } = await axios.post(
        'https://api.zarinpal.com/pg/v4/payment/verify.json',
        params
      )

      console.log('data2 => ', data)

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
