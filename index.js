const app = require('express');
const server = require('http').createServer();
const io = require('socket.io')(server);
server.listen(process.env.PORT);
console.log(`Starting sever at ${process.env.PORT}`);

//authentication library for socket.io
const jwtAuth = require('socketio-jwt-auth');

io.on("connection", (socket) => {

    console.log("user connected");

    /*
    io.use(jwtAuth.authenticate({
        secret: 'Your secret',
        algorithm: 'HS256'
    }, function(payload,done){
        //done is a callback, you can use it as follows
        User.findOne({id : payload.sub}, function(err,user){
        if(err) {
        //return error
        return done(err);
        }

        if(!user) {
        //return fail with a error message
        return done(null, false, 'user does not exist');
        }

        //return success with an error message
        return done(null,user);
        });
    }));
    */

    socket.on("user-connected", user => {
        socket.user = user;

        socket.broadcast.emit("users-changed", { user: user, event: "connected"});
    });

    socket.on("message", data => {
        io.emit("message", data);
    });

    socket.on("disconnect", () => {
        io.emit("users-changed" , { user: socket.user, event: "disconnected"});
    });
})
