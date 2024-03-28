//const Blog = require('../models/blog')
const Newblogs = require('../models/newblogs')
const cloudinary = require('../middleware/cloudinary')







const add_new_blog = async (req, res) => {


  try {
    const { author, category, title, header, blog } = req.body

    // const opt = {
    //   use_filename: true,
    //   unique_filename: false,
    //   overwrite: true,
    //   resource_type: "auto"
    // };
    if (!req.file) {
      console.log('no file')
      //return res.status(400).json({ message: 'No file uploaded' });
  }
    const filePath = req.file.path;
     // Get the file path
    // const fileData = await fsPromises.readFile(filePath);
    const result = await cloudinary.uploader.upload(filePath,{folder:'blogphotos'});

    const _blog = new Newblogs({
      author,
      category,
      title,
      header,
      heroimage_info:{ 
        public_id:result.public_id,
        url:result.secure_url
      },
      blog

    })
    //   if(req.file){
    //     _blog.heroimage=req.file.path
    //   }
    
    await _blog.save()
    console.log(req.body)
    console.log(result)
    console.log(_blog)
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

module.exports = {
  add_new_blog,
  get_blogs,
  get_a_blog,
  get_blog_category,
  delete_blog
}