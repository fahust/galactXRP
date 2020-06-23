const io = require('socket.io')();
var Universe = require('./universe.js');

universe = new Universe();


//TEST

universe.loadAll();//ok
setTimeout(() => {
    var player = {};
    player.n = "test"
    player.mdp = "mdpp"
    //universe.subscribe(player)//ok
    //obj = universe.connection(player)//ok
    //obj.x = 5
    //obj.s = 1
    //console.log(universe.move(obj));//ok
    obj.as = 1



    //console.log(universe.playerConnected)
    
    universe.saveAll();//ok
}, 100);
//TEST



io.on('connection', client => { 
    console.log(client);
    
    socket.on('action', (data) => {
        Universe.actionSocket(data);
    });
    socket.on('subscribe', (data) => {
        socket.emit('subscribe', { resp: Universe.subscribe(data,socket) });
    });
    socket.on('connection', (data) => {
        socket.emit('connection', { resp: Universe.connection(data,socket) });
    });

 });

io.listen(12000);
console.log('GalactX RP Server Running')