const express = require('express')
const { index, authentication, signin, signup } = require('../controller/public')


const router = express.Router()

router.get('/', index)

router.get('/authentication', authentication)

router.post('/signin', signin)

router.post('/signup', signup)

router.get('/wortch-Video', (req, res) => {

    req.session.message = {
        type: 'success',
        intro: 'Dear Customer before continue You must be Login',
        message: ''
    }
    res.redirect('/authentication')
})

router.post('/contactus', (req, res) => {
    console.log(req.body)

    req.session.message = {
        type: 'success',
        intro: 'Thank you.        Your Idea Received Successfull You Will Get The Response On Your Email verry Soon !!!!',
        message: ''
    }
    res.redirect('/')
})


module.exports = router