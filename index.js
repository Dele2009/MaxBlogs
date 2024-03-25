const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()
const {router} = require('./routes/routes')

const port = process.env.App_Port || 4000;
const mongo_url=process.env.Mongo_Url


const app = express()
mongoose
  .connect(mongo_url)
  .then(result => console.log('database conected'))
  .catch(err => console.log('eror' + err))

//using the ejs template to render
app.set('view engine', 'ejs')
app.set('views', 'pages')

//serving static documents
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))



//geting all data from database using mongodb mongoose

app.get('/', (req, res) => {
  res.redirect('/blogs/all-blogs')
})

app.use('/blogs', router)

app.listen(port, () => {
  console.log('App running on localhost:',port)
})


