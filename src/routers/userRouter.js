const express = require('express')
const requireAuthorization = require('../middleware/requireAuthorization')

const {
    logout,
    userHome,
    userSettings,
    userLogout,
    updateProfile,
    updateProfileInformation,
    changePassword
} = require('../controller/private')

const router = express.Router()

router.get('/user/home', requireAuthorization, userHome)

router.get('/user/settings', requireAuthorization, userSettings)

router.post('/user/settings/update-profile-picture', requireAuthorization, updateProfile)

router.post('/user/settings/update-private-information', requireAuthorization, updateProfileInformation)

router.post('/user/settings/change-password', requireAuthorization, changePassword)

router.get('/user/logout', requireAuthorization, userLogout)

router.get('/user/payment', requireAuthorization, (req, res) => {
    res.render('flutterWave', { user: req.user })
})


module.exports = router