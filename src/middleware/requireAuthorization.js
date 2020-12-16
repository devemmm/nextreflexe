const jwt = require('jsonwebtoken')
const User = require('../model/User')
const { cookie } = require('request')

const requireAuth = async(req, res, next) => {

    const { authorization } = req.cookies

    if (!authorization) {

        req.session.message = {
                type: 'danger',
                intro: 'Please You Must be Login',
                message: ''
            }
            // return res.status(401).send({ error: { message: 'Authorization token is Null' } })
        return res.status(401).redirect('/authentication')
    }
    try {
        const token = authorization.replace('Bearer ', '')

        jwt.verify(token, process.env.JWT_SECRET, async(error, payload) => {
            if (error) {
                // return res.status(401).send({ error: { message: 'Authorization Faild !!!' } })

                req.session.message = {
                    type: 'danger',
                    intro: 'Please You Must be Login',
                    message: ''
                }
                return res.status(401).redirect('/authentication')
            }

            const { _id } = payload
            const user = await User.findOne({ _id, 'tokens.token': token })

            if (!user) {
                // return res.status(401).send({ error: { message: 'Authorization Faild !!! Login Again' } })
                req.session.message = {
                    type: 'danger',
                    intro: 'Please You Must be Login',
                    message: ''
                }
                return res.status(401).redirect('/authentication')
            }

            req.token = token
            req.user = user
            next()
        })
    } catch (error) {
        return res.status(401).send({ error })
    }

}

module.exports = requireAuth