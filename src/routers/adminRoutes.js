const express = require('express')
const requireAuthorization = require('../middleware/requireAuthorization')
const {
    home,
    allPatients,
    renderAddPatients,
    addPatient,
    medicalForm,
    fullMedicalForm,
    medicalFormDetails,
    medicalFormResponses,
    apointment,
    taskboard,
    woldWideCenter,
    statisticWidget,
    weatherWidget,
    adminLogout,
    videoLesson
} = require('../controller/private')

const router = express.Router()

router.get('/admin/home', requireAuthorization, home)

router.get('/admin/all-patients', requireAuthorization, allPatients)

router.get('/admin/add-patient', requireAuthorization, renderAddPatients)

router.post('/admin/add-patient', requireAuthorization, addPatient)

router.get('/admin/patient-medical-form', requireAuthorization, medicalForm)

router.get('/admin/patient-medical-form/:id', requireAuthorization, fullMedicalForm)

router.post('/admin/patient-medical-form/:id', requireAuthorization, medicalFormDetails)

router.post('/admin/patient-medical-form/responses/:id', requireAuthorization, medicalFormResponses)

router.get('/admin/appointment', requireAuthorization, apointment)

router.get('/admin/taskboard', requireAuthorization, taskboard)

router.get('/admin/world-wide-center', requireAuthorization, woldWideCenter)

router.get('/admin/statistics-widget', requireAuthorization, statisticWidget)

router.get('/admin/weather-Widget', requireAuthorization, weatherWidget)

router.get('/admin/logout', requireAuthorization, adminLogout)

router.get('/admin/upload-video-lesson', requireAuthorization, videoLesson)


module.exports = router