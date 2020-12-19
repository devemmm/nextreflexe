const User = require('../model/User')
const Patient = require('../model/Patient')
const multer = require('multer')



const adminLogout = [
    async(req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)

            await req.user.save()
            res.clearCookie('data')
            res.clearCookie('authorization')

            res.status(200).redirect('/')
        } catch (error) {

            req.session.message = {
                type: 'success',
                intro: `${error.message}`,
                message: ''
            }

            res.redirect('/admin/all-patients')
            return res.status(500).redirect('/')
        }

    }
]

const home = [
    async(req, res) => {
        res.render('home', { user: req.user })
    }
]

const allPatients = [
    async(req, res) => {
        try {
            const patient = await Patient.find({})

            if (!patient) {
                return res.status(200).send([])
            }

            res.render('all-patients', { patient, user: req.user })
        } catch (error) {

            req.session.message = {
                type: 'success',
                intro: `${error.message}`,
                message: ''
            }

            res.redirect('/admin/all-patients')
        }
    }
]

const renderAddPatients = [

    async(req, res) => {
        res.render('patient-add', {
            user: req.user
        })
    }
]

const addPatient = [
    async(req, res) => {

        try {

            // save patent in database
            const patient = new Patient(req.body)

            await patient.save();

            req.session.message = {
                type: 'success',
                intro: 'Register new Patient Successfull !!! ',
                message: ''
            }

            res.status(200).redirect('/admin/add-patient')
        } catch (error) {
            req.session.message = {
                type: 'success',
                intro: `${error.message}`,
                message: ''
            }

            return res.redirect('/add-patient')
        }
    }
]

const apointment = [
    async(req, res) => {
        res.render('appointment', {
            user: req.user
        })
    }
]

const taskboard = [
    async(req, res) => {
        res.render('taskboard', {
            user: req.user
        })
    }
]

const medicalForm = [
    async(req, res) => {
        res.render('patient-medical-Form', {
            user: req.user
        })
    }
]

const fullMedicalForm = [
    async(req, res) => {
        const _id = req.params.id

        try {
            const patient = await Patient.findById({ _id })

            if (!patient) {

                req.session.message = {
                    type: 'success',
                    intro: `Patient Not Found`,
                    message: ''
                }

                return res.redirect('/patient-medical-form')

            }

            res.status(200).render('patient-medical-Form', { patient, user: req.user })
        } catch (error) {
            req.session.message = {
                type: 'success',
                intro: `${error.message}`,
                message: ''
            }

            return res.redirect('/patient-medical-form')
        }
    }
]

const medicalFormDetails = [
    async(req, res) => {

        var dataUpdates = req.body

        const deleteEmptyData = ({ diagnosis, recommendedTherapy, recommendedMedecine, recommendedDiets } = req.body) => {

            if (diagnosis === '') {
                delete dataUpdates["diagnosis"]
            }

            if (recommendedTherapy === '') {
                delete dataUpdates["recommendedTherapy"]
            }

            if (recommendedMedecine === '') {
                delete dataUpdates["recommendedMedecine"]
            }

            if (recommendedDiets === '') {
                delete dataUpdates["recommendedDiets"]
            }
        }

        deleteEmptyData()

        const updates = Object.keys(dataUpdates)
        const allowedUpdates = ['diagnosis', 'recommendedTherapy', 'recommendedMedecine', 'recommendedDiets']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {

            req.session.message = {
                type: 'danger',
                intro: 'Invalid Update',
                message: ''
            }
            return res.status(400).redirect('/admin/patient-medical-form', {
                user: req.user
            })
        }

        try {

            const patient = await Patient.findById({ _id: req.params.id })

            if (!patient) {
                req.session.message = {
                    type: 'success',
                    intro: 'No Patients founds',
                    message: ''
                }

                return res.redirect('/admin/patient-medical-form')
            }

            updates.forEach((update) => patient.details[update] = dataUpdates[update])

            await patient.save()

            req.session.message = {
                type: 'success',
                intro: 'Patient Medical Form Updated !!! ',
                message: ''
            }

            res.status(200).redirect('/admin/patient-medical-form')

        } catch (error) {
            if (error.kind === "ObjectId") {

                req.session.message = {
                    type: 'danger',
                    intro: 'Invalid Object id',
                    message: ''
                }
                return res.status(400).redirect('/admin/patient-medical-form')
            }

            req.session.message = {
                type: 'danger',
                intro: `${error.message}`,
                message: ''
            }
            res.status(500).redirect('/admin/patient-medical-form')
        }
    }
]

const medicalFormResponses = [
    async(req, res) => {

        var dataUpdates = req.body


        const deleteEmptyData = ({ month1, month2, month3, month6, year1 } = req.body) => {

            if (month1 === '') {
                delete dataUpdates["month1"]
            }

            if (month2 === '') {
                delete dataUpdates["month2"]
            }

            if (month3 === '') {
                delete dataUpdates["month3"]
            }

            if (month6 === '') {
                delete dataUpdates["month6"]
            }

            if (year1 === '') {
                delete dataUpdates["year1"]
            }
        }

        deleteEmptyData()
        const updates = Object.keys(dataUpdates)
        const allowedUpdates = ['month1', 'month2', 'month3', 'month6', 'year1']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid Update' })
        }

        try {

            //const _id = '5fbe5aaf3327aa11cca90bb9'

            const patient = await Patient.findById({ _id: req.params.id })

            if (!patient) {
                req.session.message = {
                    type: 'success',
                    intro: 'No patients founds',
                    message: ''
                }
                return res.redirect('/patient-medical-form')
            }

            updates.forEach((update) => patient.response[update] = dataUpdates[update])

            await patient.save()

            req.session.message = {
                type: 'success',
                intro: 'Patient Response updated Success !!!!',
                message: ''
            }
            res.status(200).redirect('/admin/patient-medical-form')

        } catch (error) {
            if (error.kind === "ObjectId") {
                req.session.message = {
                    type: 'danger',
                    intro: 'Invalid Object id',
                    message: ''
                }
                return res.status(400).redirect('/patient-medical-form')
            }

            req.session.message = {
                type: 'danger',
                intro: `${error.message}`,
                message: ''
            }
            return res.status(500).redirect('/patient-medical-form')
        }
    }
]

const woldWideCenter = [
    async(req, res) => {
        res.render('our-centres', {
            user: req.user
        })
    }
]

const statisticWidget = [
    async(req, res) => {
        res.render('widgets-statistics', { user: req.user })
    }
]

const weatherWidget = [
    async(req, res) => {
        res.render('widgets-weather', { user: req.user })
    }
]

// handle User Routes

const userHome = [
    async(req, res) => {

        const user = req.user

        if (!user.hasAccess) {
            return res.status(200).render('non-paid-userHome', { user })
        }
        res.render('userHome', { user })
    }
]

const checkPayment = [
    async(req, res) => {

        res.render('userHome')
    }
]

const userSettings = [
    async(req, res) => {
        res.render('user-settings', { user: req.user })
    }
]

const userLogout = [
    async(req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)

            await req.user.save()

            res.clearCookie('data')
            res.clearCookie('authorization')

            res.status(200).redirect('/')
        } catch (error) {
            req.session.message = {
                type: 'danger',
                intro: `${error.message }`,
                message: ''
            }

            res.status(500).redirect('/authentication')

        }
    }
]

const videoLesson = [
    async(req, res) => {
        res.render('videoLesson', { user: req.user })
    }
]

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/public/profile-picture')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})


const avatar = multer({
    storage,
    limits: {
        fieldSize: 9000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please Upload a Valid Image'))
        }

        cb(undefined, true)
    }
})

const updateProfile = [
    avatar.single('upload'), async(req, res) => {
        try {

            var path = `${process.env.SITE_URL}/profile-picture/0default_picture.png`
            if (req.file) {
                console.log(req.file.path)
                path = (req.file.path).replace('src/public', process.env.SITE_URL)
            }


            req.user["profilePhoto"] = path
            await req.user.save()

            req.session.message = {
                type: 'success',
                intro: 'Update Profile Picture Succesfull !!!',
                message: ''
            }

            res.status(200).redirect('/user/settings')
        } catch (error) {

            req.session.message = {
                type: 'danger',
                intro: `${error.message }`,
                message: ''
            }
            res.status(400).redirect('/user/settings')
        }
    }, (error, req, res, next) => {
        req.session.message = {
            type: 'danger',
            intro: `${error.message }`,
            message: ''
        }
        res.status(400).redirect('/user/settings')
    }
]


const updateProfileInformation = [
    async(req, res) => {

        const dataUpdates = req.body

        const deleteEmptyData = ({ fname, lname, phone, phone2, address, nationality, zipcode } = req.body) => {

            if (fname === '') {
                delete dataUpdates["fname"]
            }

            if (lname === '') {
                delete dataUpdates["lname"]
            }

            if (phone === '') {
                delete dataUpdates["phone"]
            }

            if (phone2 === '') {
                delete dataUpdates["phone2"]
            }

            if (address === '') {
                delete dataUpdates["address"]
            }


            if (nationality === '') {
                delete dataUpdates["nationality"]
            }

            if (zipcode === '') {
                delete dataUpdates["zipcode"]
            }
        }

        deleteEmptyData()

        const updates = Object.keys(dataUpdates)
        const allowedUpdates = ['fname', 'lname', 'phone', 'phone2', 'address', 'nationality', 'zipcode']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid Update' })
        }

        try {


            const user = await User.findById({ _id: req.user._id })


            if (!user) {
                return res.send({ msg: 'User Not Founds' })
            }

            updates.forEach((update) => user[update] = dataUpdates[update])

            await user.save()

            req.session.message = {
                type: 'success',
                intro: 'User Private Information updated Success !!!!',
                message: ''
            }
            res.status(200).redirect('/user/settings')

        } catch (error) {
            if (error.kind === "ObjectId") {
                return res.status(400).send({ error: 'Invalid Object id' })
            }
            return res.status(500).send(error)
        }
    }
]


const changePassword = [
    async(req, res) => {


        try {
            const { newPassword, confirmPassword } = req.body

            if (newPassword != confirmPassword) {


                req.session.message = {
                    type: 'danger',
                    intro: 'Password Does Not Mutch',
                    message: 'Try Again'
                }

                return res.status(200).redirect('/user/settings')
            }

            req.user['password'] = newPassword

            await req.user.save()

            req.session.message = {
                type: 'success',
                intro: 'Password Update Succesfull !!!',
                message: ''
            }

            res.status(200).redirect('/user/settings')
        } catch (error) {
            req.session.message = {
                type: 'danger',
                intro: `${error.message}`,
                message: 'Try Again'
            }

            return res.staus(200).redirect('/user/settings')
        }

        //return res.status(201).send({ updatedPassword })
    }
]


const updateStatus = [
    async(req, res) => {
        try {

            const user = await User.findById({ _id: req.user._id })


            if (!user) {
                return res.send({ msg: 'User Not Founds' })
            }

            user.hasAccess = true

            await user.save()

            req.session.message = {
                type: 'success',
                intro: 'You Have fineshed to Pay Now you can Wortch the Video',
                message: ''
            }
            res.status(200).redirect('/user/home')

        } catch (error) {
            if (error.kind === "ObjectId") {
                return res.status(400).send({ error: 'Invalid Object id' })
            }
            return res.status(500).send(error)
        }
    }
]


module.exports = {
    home,
    allPatients,
    renderAddPatients,
    addPatient,
    taskboard,
    apointment,
    adminLogout,
    medicalForm,
    fullMedicalForm,
    medicalFormDetails,
    medicalFormResponses,
    woldWideCenter,
    statisticWidget,
    weatherWidget,
    userHome,
    userSettings,
    userLogout,
    videoLesson,
    updateProfile,
    updateProfileInformation,
    updateStatus,
    changePassword
}