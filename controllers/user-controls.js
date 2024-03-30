const Newuser = require('../models/User')
const cloudinary = require('../middleware/cloudinary')
const bcrypt = require('bcrypt')

const add_new_user = async (req, res) => {
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
        const salt = await bcrypt.genSalt(15);
        const hashpassword = await bcrypt.hash(password, salt);

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
                req.session.user = user;
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
        }
        const userId = req.session.user._id;
        const user = await Newuser.findById(userId)
        //const user = await User.findById(userId).populate('authoredBlogs');
        if (!user) throw new Error('User not found');
        res.render('user_dashboard', { User: user });
    } catch (error) {
        return res.status(500).send('Error fetching dashboard: ' + error.message);
    }
}



const log_out = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
};

module.exports = {
    add_new_user,
    log_in,
    Show_user_dashboard,
    log_out
}