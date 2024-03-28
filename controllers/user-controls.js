const Newuser = require('../models/User')
const cloudinary = require('../middleware/cloudinary')

const add_new_user = async (req, res) => {
    try {
        const { name, email, password } = req.body

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
        const result = await cloudinary.uploader.upload(filePath, { folder: 'UserAvatars' });

        const _user_account_info = new Newuser({
            name,
            email,
            avatar_info: {
                public_id: result.public_id,
                url: result.secure_url
            },
            password
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

const log_in = async(req,res)=>{
   
    try {
        const email = req.body.email
        const password = req.body.password    
        const user = await Newuser.findOne({email:email})
        if(user){
            if(user.password===password){
                   console.log(user)
                   res.render('user_dashboard',{User:user})
            }
            else{
                console.log('password error')
            }
        }else{
            console.log('user does not exist')
        }
    } catch (error) {
        
    }
}

module.exports={
    add_new_user,
    log_in
}