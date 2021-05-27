const User = require("../../../models/user")
const jwt=require('jsonwebtoken');
const env=require('../../../config/environment');

module.exports.sign_in=async function(req,res){
    try{
        let user=await User.findOne({email:req.body.email});
        if(!user || (user.password!=req.body.password)){
            return res.json(422,{
                messsage:'Invalid Username/Password'
            });
        }
        else{
            return res.json(200,{
                message:'Signed in!',
                data:{
                    token:jwt.sign(user.toJSON(),env.jwt_secret,{expiresIn:'100000'})
                }
            })
        }
    }catch{
        console.log("Error");
        res.json(500,{
            message:'Internal Server Error'
        });
    }
    
    
}