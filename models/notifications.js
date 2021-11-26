const mongoose = require('mongoose');

const NotficationSchema=new mongoose.Schema({
    content : {
        type:String,
    },
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    type:{
        type:String
    },
    pid:{
        type:mongoose.Schema.Types.ObjectId
    }
},{
    timestamps:true
})

const Notifications = mongoose.model('Notifications',NotficationSchema);
module.exports = Notifications;