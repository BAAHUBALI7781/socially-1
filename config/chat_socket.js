const {WebD,ML,IP,CP} = require('../models/chat');

function convert(date){
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    var day=date.getDate();
    var month=date.getMonth()+1;
    var year=date.getFullYear();
    var hour=date.getHours();
    var min=date.getMinutes();
    rdate=day+'/'+month+'/'+year;
    rtime=hour+':'+min;
    return {
        rdate:rdate,
        rtime:rtime
    }
}
module.exports.chatSocket = function(chatServer){
    let io = require('socket.io')(chatServer);

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);
        socket.on('disconnect', function(){
            console.log("Socket disconnected");
        });
        socket.on('join_room',async function(data){
            var date=new Date();
            const obj=await convert(date);
            data.date=obj.rdate;
            data.time=obj.rtime;
            socket.join(data.room_id);
            io.in(data.room_id).emit('user_join',data);
        });
        socket.on('send',async function(data){
            var date=new Date();
            const obj=convert(date);
            data.date=obj.rdate;
            data.time=obj.rtime;
            
            console.log(data);
            let newMessage;
            if(data.room_id=='Technology')
            {
                newMessage=await WebD.create(data);
            }else if(data.room_id=='Careers'){
                newMessage=await ML.create(data);
            }else if(data.room_id=='Food'){
                newMessage=await CP.create(data);
            }else if(data.room_id=='Travel'){
                newMessage=await IP.create(data);
            }
            console.log(data);
            data.id=newMessage.id;
            io.in(data.room_id).emit('receive',data);
        })

    });
}

