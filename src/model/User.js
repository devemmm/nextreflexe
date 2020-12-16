const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



const userSchema = new mongoose.Schema({
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
    email: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    phone2: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        isAdmin: {
            type: Boolean,
            trim: true,
            default: false
        },
        other: {
            type: String,
            default: 'current_user'
        }
    },
    hasAccess: {
        type: Boolean,
        trim: true,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    profilePhoto: {
        type: String,
        default: `${process.env.SITE_URL}/profile-picture/0default_picture.png`
    },

    nationality: {
        type: String,
        trim: true,
        default: 'Rwanda'
    },
    province: {
        type: String,
        trim: true,
        default: null
    },
    district: {
        type: String,
        trim: true,
        default: null
    },
    sector: {
        type: String,
        trim: true,
        default: null
    },
    cell: {
        type: String,
        trim: true,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    zipcode: {
        type: Number,
        trim: true
    }

}, {
    timestamps: true
})




// userSchema.virtual('tasks', {
//     ref: 'Task',
//     localField: '_id',
//     foreignField: 'owner'
// })


userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens


    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async(email, password) => {

    if (!email || !password) {
        throw new Error('You must provide email and password')
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Email Not Found !!!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Wrong Password !!!')
    }

    return user

}

// Hash the plain text password before save
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


// Delete User Task when user is removed

userSchema.pre('remove', async function(next) {
    const user = this

    await Task.deleteMany({ owner: user._id })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User