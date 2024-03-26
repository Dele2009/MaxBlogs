const express = require('express')

// const Blog = require('../models/blog')
const Newblogs = require('../models/newblogs')
const upload= require('../middleware/upload')

const router = express.Router()

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' })
})
router.get('/create', (req, res) => {
  res.render('blogs', { title: 'Create A Blog' })
})

router.post('/add-blog',upload.single('heroimage') ,async (req, res) => {
 
  const _blog = new Newblogs({
    author:req.body.author,
    category:req.body.category,
    title:req.body.title,
    header:req.body.header,
    heroimage:req.file.filename,
    blog:req.body.blog

  })
//   if(req.file){
//     _blog.heroimage=req.file.path
//   }
  console.log(req.body)
  console.log(req.file)
  console.log(_blog)

  try {
    await _blog.save()
    res.redirect('/')
   
  } catch (error) {
    console.log(error)
  }
})

//get all blogs
router.get('/all-blogs', async (req, res) => {
  try {
    // const result = await Blog.find()
    const result = await Newblogs.find().sort({ createdAt: -1 })

    res.render('test', { title: 'Home', Blogs: result })
  } catch (error) {
    console.log(error)
  }
})


//get blog by id
router.get('/:id', async (req, res) => {
  const id = req.params.id
  console.log(id)
  try {
    // const result = await Blog.findById(id)
    const result = await Newblogs.findById(id)
    res.render('blogView', { title: 'blog Details', Blog: result })
  } catch (error) {
    console.log(error)
  }
})



router.get('/category/:id', async (req, res) => {
  const id = req.params.id
  console.log(id)
  try {
    // const result = await Blog.findById(id)
    const result = await Newblogs.find({ category: id })
    res.render('blogcategory', { title: `${id}`, Blogs: result })
  } catch (error) {
    console.log(error)
  }
})



router.delete('/:id', async (req, res) => {
  const id = req.params.id
  console.log(id)
  try {
    // const result = await Blog.findById(id)
    await Newblogs.findByIdAndDelete(id)
    res.json({ redirect: '/' })
  } catch (error) {
    console.log(error)
  }
})

module.exports = {router}
