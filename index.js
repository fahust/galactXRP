const io = require('socket.io')();
var Universe = require('./universe.js');

universe = new Universe();


//TEST

universe.loadAll();//ok
setTimeout(() => {
    var player = {};
    player.n = "test"
    player.mdp = "mdpp"
    universe.subscribe(player)
    
    //universe.saveAll();//ok
    console.log(universe)
}, 1000);
//TEST



io.on('connection', client => { 

    
    socket.on('move', (data) => {
        socket.emit('move', { resp:  Universe.move(data) });
    });
    socket.on('subscribe', (data) => {
        socket.emit('subscribe', { resp: Universe.subscribe(data) });
    });
    socket.on('connection', (data) => {
        socket.emit('connection', { resp: Universe.connection(data) });
    });

 });

io.listen(3000);
console.log('GalactX RP Server Running')