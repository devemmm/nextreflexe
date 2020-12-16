const express = require('express')
const mongoose = require('mongoose')


const details = new mongoose.Schema({
    diagnosis: {
        type: String
    },
    recommendedTherapy: {
        type: String
    },
    recommendedMedecine: {
        type: String
    },
    recommendedDiets: {
        type: String
    }
}, {
    timestamps: true
})

const response = mongoose.Schema({
    month1: {
        type: String
    },
    month2: {
        type: String
    },
    month3: {
        type: String
    },
    month6: {
        type: String
    },
    year1: {
        type: String
    }
}, {
    timestamps: true
})
const patientSchema = new mongoose.Schema({
    fname: {
        type: String,
        trim: true,
        required: true
    },
    lname: {
        type: String,
        trim: true,
        required: true
    },
    age: {
        type: Number,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    weight: {
        type: Number,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        trim: true,
        required: true
    },
    service: {
        type: String,
        trim: true,
        required: true
    },
    pCondition: {
        type: String,
        trim: true,
        default: "Null"
    },
    lastVisit: {
        type: Date,
        default: "2020-01-01"
    },
    status: {
        type: String,
        default: 'Pending'
    },
    details: {
        diagnosis: {
            type: String
        },
        recommendedTherapy: {
            type: String
        },
        recommendedMedecine: {
            type: String
        },
        recommendedDiets: {
            type: String
        }
    },
    response: {
        month1: {
            type: String
        },
        month2: {
            type: String
        },
        month3: {
            type: String
        },
        month6: {
            type: String
        },
        year1: {
            type: String
        }
    }
}, {
    timestamps: true
})

const Patient = mongoose.model('Patient', patientSchema)

module.exports = Patient