class ChatEngine{constructor(e,s){this.chatBox=$("#"+e),this.userEmail=s,this.socket=io.connect("http://localhost:8000",{transports:["websocket","polling","flashsocket"]}),this.userEmail&&this.connectionHandler()}connectionHandler(){let e=this;this.socket.on("connect",(function(){console.log("Connection established using sockets...!")})),e.socket.emit("join_room",{user_email:e.userEmail,room_id:"Socio chatroom"}),e.socket.on("user_join",(function(e){console.log("A new user joined",e)})),$("#send-message").click((function(){let s=$("#message-input").val();console.log(s),""!=s&&e.socket.emit("send",{message:s,user_email:e.userEmail,room_id:"Socio chatroom"})})),e.socket.on("receive",(function(s){console.log("Message : ",s.message);let o=$("<li>"),t="receive-message";s.user_email==e.userEmail&&(t="message-send"),o.append($("<span>",{html:s.message})),o.addClass(t),$(".message-list").append(o),updateScroll()}))}}function updateScroll(){var e=document.getElementById("message-list-container");e.scrollTop=e.scrollHeight}