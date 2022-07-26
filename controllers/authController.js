let controller = require('./controller')
const { validationResult } = require('express-validator')
const passport = require('passport')
var Recaptcha = require('express-recaptcha').RecaptchaV2
const options = { hl: 'fa' }
const recaptcha = new Recaptcha(
  '6LeydhshAAAAABlHLajUhOqhQtRYKuGEMgBKeAiI',
  '6LeydhshAAAAAKJmk6Hu36ik2bHC9DyF6tEEWAo4',
  options
)

class AuthController extends controller {
  async registerForm(req, res, next) {
    try {
      res.render('auth/register', { recaptcha: recaptcha.render() })
    } catch (err) {
      next(err)
    }
  }

  async loginForm(req, res, next) {
    try {
      res.render('auth/login')
    } catch (err) {
      next(err)
    }
  }

  async register(req, res, next) {
    try {
      let recaptchaResult = await new Promise((resolve, reject) => {
        recaptcha.verify(req, (err, data) => {
          if (err) {
            req.flash('errors', 'تیک گزینه امنیتی را بزنید')
            res.redirect('/auth/register')

            resolve(false)
          } else {
            resolve(true)
          }
        })
      })

      if (!recaptchaResult) {
        return
      }

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        let myErrors = errors.array().map((err) => err.msg)
        req.flash('errors', myErrors)
        return res.redirect('/auth/register')
      }

      passport.authenticate('local.register', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/register',
        failureFlash: true,
      })(req, res, next)
    } catch (err) {
      next(err)
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        let myErrors = errors.array().map((err) => err.msg)
        req.flash('errors', myErrors)
        return res.redirect('/auth/login')
      }

      passport.authenticate('local.login', (err, user) => {
        if (!user) return res.redirect('/auth/login')

        req.logIn(user, (err) => {
          return res.redirect('/dashboard')
        })
      })(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new AuthController()
