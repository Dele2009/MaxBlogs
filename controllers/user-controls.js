const Newuser = require('../models/User')
const Newblogs = require('../models/newblogs')
const cloudinary = require('../middleware/cloudinary')
const bcrypt = require('bcrypt')

const sign_up = async (req, res) => {
    try {
        const { name, email, password } = req.body
        // if (!_csrf || _csrf !== req.csrfToken()) {
        //     console.log('invlid crf')
        //     res.status(403).send('CSRF token invalid');
        //     return;
        //   }


        // const opt = {
        //   use_filename: true,
        //   unique_filename: false,
        //   overwrite: true,
        //   resource_type: "auto"
        // };
        const exist = Newuser.findOne({ email });
        if (exist) {
            console.log('User Already Exists')
        }
        if (!req.file) {
            console.log('no file')
            //return res.status(400).json({ message: 'No file uploaded' });
        }
        const filePath = req.file.path;
        const result = await cloudinary.uploader.upload(filePath, { folder: 'UserAvatars' });
        const hashpassword = await bcrypt.hash(password, 15);

        const _user_account_info = new Newuser({
            name,
            email,
            avatar_info: {
                public_id: result.public_id,
                url: result.secure_url
            },
            password: hashpassword
        })
        //   if(req.file){
        //     _blog.heroimage=req.file.path
        //   }

        await _user_account_info.save()
        console.log(req.body)
        console.log(result)
        console.log(_user_account_info)
        res.redirect('/user/log-in')

    } catch (error) {
        console.log(error)
    }
}

const log_in = async (req, res) => {

    try {
        const { email, password } = req.body
        const user = await Newuser.findOne({ email })
        if (user) {
            const is_matched = await bcrypt.compare(password, user.password)
            if (is_matched) {
                console.log(user)
                req.session.user = {
                    _id:user._id,
                    name:user.name,
                    avatar_info:user.avatar_info
                };
                console.log(req.session)
                res.redirect('/user/dashboard')
            }
            else {
                console.log('password error')
            }
        } else {
            console.log('user does not exist')
        }
    } catch (error) {
        console.log(error)
    }
}

const Show_user_dashboard = async (req, res) => {
    try {
        if (!req.session.user) {
            // If session exists but user is not logged in, redirect to login page
            return res.redirect('/user/log-in');
        } else {
            const user = req.session.user;
            // const user = await Newuser.findById(userId)
            //const user = await User.findById(userId).populate('authoredBlogs');
            if (!user) { 
                throw new Error('User not found'); 
            }
            else {
                res.render('user_dashboard', { User: user });
            }
        }
    } catch (error) {
        return res.status(500).send('Error fetching dashboard: ' + error.message);
    }
}

const load_blogCreate = async (req, res) => {
    try {
        const user = req.session.user;
        // const user = await Newuser.findById(user.id)
        // const Author_name = user.name;
        return res.render('blogs', { title: 'Create A Blog', User:user })
    } catch (error) {
        console.log(error)
    }
    
}



const create_blog = async (req, res) => {


    try {
      const { author_id, author, category, title, header, blog } = req.body
  
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
        author_id,
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



const log_out = async (req, res) => {
    try {
        await req.session.destroy(); // Async operation to destroy the session
        return res.redirect('/user/log-in'); // Redirect to login page after logout
    } catch (error) {
        console.error('Error destroying session:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    sign_up,
    log_in,
    Show_user_dashboard,
    load_blogCreate,
    create_blog,
    log_out
}