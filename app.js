const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const {router} = require('./routes/routes')

const app = express()

const bdurl =
  'mongodb+srv://deleblog:testman@deles-node-site.flhcpxp.mongodb.net/dele-node-practice?retryWrites=true&w=majority&appName=Deles-node-site'
mongoose
  .connect(bdurl)
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

//saving data to database using mongodb mongoose
// app.get('/add-blog',async(req,res)=>{
//   const blog = new Blog({
//      title:'nrw blog 2',
//      header:'this is a blog',
//      blog:'i am writing blog now'
//   })
//   try {
//     const result =await blog.save()
//     res.send(result)
//   } catch (error) {
//     console.log(error)
//   }

// })

//geting all data from database using mongodb mongoose

app.get('/', (req, res) => {
  res.redirect('/blogs/all-blogs')
})

app.use('/blogs', router)

app.listen(4000, () => {
  console.log('App running on 4000')
})

//Add new blog

// app.get('/',(req,res)=>{
//     res.send()
// })
