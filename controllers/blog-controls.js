const Blog = require('../models/blog')
const Newblogs = require('../models/newblogs')


const add_new_blog = async (req, res) => {
 
    const _blog = new Newblogs({
      author:req.body.author,
      category:req.body.category,
      title:req.body.title,
      header:req.body.header,
      heroimage:{
        // req.file.filename,
        data:req.file.buffer,
        contentType:req.file.mimetype
      },
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
}


const get_blogs = async (req, res) => {
    try {
      // const result = await Blog.find()
      const result = await Newblogs.find().sort({ createdAt: -1 })
  
      res.render('test', { title: 'Home', Blogs: result })
    } catch (error) {
      console.log(error)
    }
  }


  const get_a_blog = async (req, res) => {
  const id = req.params.id
  console.log(id)
  try {
    // const result = await Blog.findById(id)
    const result = await Newblogs.findById(id)
    res.render('blogView', { title: 'blog Details', Blog: result })
  } catch (error) {
    console.log(error)
  }
}



const get_blog_category = async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
      // const result = await Blog.findById(id)
      const result = await Newblogs.find({ category: id })
      res.render('blogcategory', { title: `${id}`, Blogs: result })
    } catch (error) {
      console.log(error)
    }
  }


  const delete_blog = async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
      // const result = await Blog.findById(id)
      await Newblogs.findByIdAndDelete(id)
      res.json({ redirect: '/' })
    } catch (error) {
      console.log(error)
    }
  }

module.exports={
    add_new_blog,
    get_blogs,
    get_a_blog,
    get_blog_category,
    delete_blog
}