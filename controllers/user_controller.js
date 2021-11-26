
const User=require('../models/user');
const fs=require('fs');
const path=require('path');
const Post = require("../models/post");


async function pop(posts)
{
    console.log(posts);
    for(postx of posts)
    {
        for(commentx of postx.comments)
        {
            commentx=await commentx.populate('user user_name');
        }
    }
    return posts;
}
module.exports.profile= function(req,res){
    
    User.findById(req.params.id,async function(err,user){
        let posts=await Post.find({user:user})
        .populate('user user_name')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
            },
            populate: {
                path: 'likes'
            }
        }).populate('comments')
        .populate('likes')

        return res.render('profile',{
            title:'Socio User Profile',
            profile_user:user,
            posts:posts
        });
    })
    

}

module.exports.update_profile=async function(req,res){
    
    if(req.user.id==req.params.id){
        try{
            user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('Multer Error',err);
                }
                else{
                    user.user_name=req.body.user_name;
                    user.email=req.body.email;
                    user.fb=req.body.fb;
                    user.linked=req.body.linked;
                    user.twitter=req.body.twitter;
                    user.insta=req.body.insta;

                    if(req.file){
                        if(user.avatar){
                            if(fs.existsSync(path.join(__dirname,'..',user.avatar))){
                                fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                            }
                            
                        }
                        user.avatar=User.avatarPath+'/'+req.file.filename;
                    }
                    user.save();
                    req.flash('success','Updated Succesfully');
                    return res.redirect('back');
                }
            })
            
            
        }catch(err){
                req.flash('error',err);
                return res.redirect("back");
        }
            
    }
    else{
        req.flash('error','Unauthorized')
        return res.status(401).send('Unauthorized');
    }  
}

module.exports.signUpPage=function(req,res){
    if(req.isAuthenticated())
    {
        return res.redirect('/user/profile');
    }
    return res.render('signup',{
        title:'Socio Sign-Up Page'
    });
}
module.exports.signInPage=function(req,res){
    if(req.isAuthenticated())
    {
        return res.redirect('/user/profile');
    }
    return res.render('signin',{
        title:'Socio Sign-In Page'
    });
}
module.exports.sign_up=function(req,res){
    if(req.body.password!=req.body.confirm_password)
    {
        req.flash('error','Passwords does not match')
        return res.redirect('sign-up-page');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            req.flash('error','Some error occured');
            return;
        }
        if(!user){
            User.create(req.body,function(err,newUser){
                if(err){
                    req.flash('error','Error in creating account');
                    return res.redirect('/');
                }
                else
                {
                    req.flash('success','Account created succesfully');
                    return res.redirect('sign-in-page');
                }
            })
        }
        else{
            console.log('Email exists!!');
            return res.redirect('sign-in-page');
        }
    })
    
}
    

module.exports.sign_in=function(req,res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

module.exports.sign_out=function(req,res){
    
    req.logout();
    req.flash('success','Logged out Successfully');
    return res.redirect('/');
}

module.exports.forget_email_page=function(req,res){
    return res.render('forget_email',{
        title:'Forgot Password'
    });
}

module.exports.search=async function(req,res){
    const name=(req.body.people);
    name.toLowerCase();;
    const allUsers=await User.find({});
    
    const filteredUsers=await allUsers.filter(user=>{
        const currUser=user.user_name.toLowerCase();;
        return currUser.includes(name);
    })
    return res.render('people_found',{
        users:filteredUsers,
        name:req.body.people,
        title:'Search People'
    });
}