const express = require('express')

const upload = require('../middleware/upload')
const usercontrols = require('../controllers/user-controls')

const user_router = express.Router()


user_router.get('/sign-up', (req, res) => {
    res.render('Signup', { title: 'Sign Up' })
})

user_router.post('/sign-up',upload.single('avatar'), usercontrols.add_new_user )

user_router.get('/log-in',(req, res) => {
    res.render('Login', { title: 'Login' })
})

user_router.post('/log-in', usercontrols.log_in)

module.exports= {user_router}