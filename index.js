const io = require('socket.io')();
var Planet = require('./player.js');

io.on('connection', client => { 

    //socket.emit('connect', { hello: 'You are connected' });
    socket.on('move', (data) => {
        console.log(data);
      });
 });

io.listen(3000);
console.log('GalactX RP Server Running')