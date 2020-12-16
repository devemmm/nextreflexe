const validator = require('validator')
const { body, validationResult } = require('express-validator')
const User = require('../model/User')
const requireAuthorization = require('../middleware/requireAuthorization')
const { cookie } = require('request')

const index = [
    async(req, res) => {
        res.render('index')
    }
]

const authentication = [
    async(req, res) => {
        try {
            res.render('authenticationForm')
        } catch (error) {

        }
    }
]

const signin = [
    async(req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            req.session.message = {
                type: 'danger',
                intro: 'Validation Error:',
                message: 'You must provide email and password'
            }
            return res.redirect('/authentication')
        }

        try {

            const user = await User.findByCredentials(email, password)

            if (user) {
                const token = await user.generateAuthToken()
                res.cookie('data', user)
                res.cookie('authorization', token)

                //Differenciate User and Admin

                const { status } = user

                res.cookie('data', user)

                if (status.isAdmin) {
                    return res.redirect('/admin/home')
                }

                if (!status.isAdmin && status.other === 'current_user') {

                    return res.redirect('/user/home')
                }
            }

        } catch (error) {
            req.session.message = {
                type: 'danger',
                intro: 'System Error:',
                message: `${error.message}`
            }
            res.redirect('/authentication')
        }
    }
]

const signup = [
    body('fname', 'First Name Must be Required').isLength({ min: 3 }).withMessage({ error: 'Atleast First Name Must be 3 in Length' }).trim().escape(),
    body('lname', 'Last Name Must be Required').isLength({ min: 3 }).withMessage({ error: 'Atleast Last Name Must be 3 in Length' }).trim().escape(),
    body('phone', 'Phone Number Must be Required').isLength({ min: 3 }).withMessage({ error: 'Atleast phone number Must be 3 in Length' }).trim().escape(),
    body('email', 'Email Address Must be Required').isLength({ min: 3 }).withMessage({ error: 'Atleast Email Address be 8 in Length' }).trim().escape(),
    body('password', 'Password Name Must be Required').isLength({ min: 6 }).withMessage({ error: 'Atleast Password Must be 6 in Length' }).trim().escape(),
    body('password2', 'Confirm Pasword Must be Required').isLength({ min: 6 }).withMessage({ error: 'Atleast Password Must be 6 in Length' }).trim().escape(),
    async(req, res) => {
        try {

            const { fname, lname, phone, email, password, password2 } = req.body

            // Check if Errors in inputs data
            const errors = validationResult(req)

            if (!errors.isEmpty()) {

                const errorStore = errors.array() // This store shold be any array of object

                const errorMsg = errorStore[0].msg.error

                req.session.message = {
                    type: 'danger',
                    intro: 'Error: ',
                    message: errorMsg
                }
                return res.redirect('/authentication')
            }

            const isSamePassword = (password, password2) => {
                if (password === password2) {
                    return true
                } else {
                    return false
                }
            }

            const includePassword = (password) => {
                if (password.includes('password')) {
                    return true
                } else if (password.includes('Password')) {
                    return true
                } else {
                    return false
                }
            }

            if (!validator.isEmail(email)) {
                req.session.message = {
                    type: 'danger',
                    intro: 'Validation Error:',
                    message: 'Invalid Email try again !!!'
                }

                return res.redirect('/authentication')
            }



            if (!isSamePassword(password, password2)) {
                req.session.message = {
                    type: 'danger',
                    intro: 'Validation Error:',
                    message: 'Password dos not Match try again !!!'
                }

                return res.redirect('/authentication')
            }

            if (includePassword(password)) {
                req.session.message = {
                    type: 'danger',
                    intro: 'Validation Error:',
                    message: 'Password Should not include Password !!!'
                }

                return res.redirect('/authentication')
            }

            // CREATE ACCOUNT
            const user = new User(req.body)
            await user.save()

            // GENERATE AUTHORIZATION TOKEN {TRACK USER LOGGED IN }
            const token = await user.generateAuthToken()

            res.cookie('data', user)

            req.session.message = {
                type: 'success',
                intro: 'Account Created Successfully !!!',
                message: 'Please Login To Continue'
            }
            res.redirect('/authentication')

        } catch (error) {
            req.session.message = {
                type: 'danger',
                intro: 'Validation Error:',
                message: `${error.message}`
            }
            return res.redirect('/authentication')
        }
    }
]


module.exports = { index, authentication, signin, signup }