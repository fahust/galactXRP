var Player = require('./player.js');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 1;
/*
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

var hashed = '';

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
        hashed = hash;
        
        
        bcrypt.compare(myPlaintextPassword, hashed, function(err, result) {
            // result == true
            console.log(myPlaintextPassword,'     -     ',hashed);
            console.log(result);
        });
        bcrypt.compare(someOtherPlaintextPassword, hashed, function(err, result) {
            // result == false
            console.log(someOtherPlaintextPassword,'     -     ',hashed);
            console.log(result);
        });


    });
});*/



class Universe {

    constructor(){
        this.playerConnected;
        this.playerSaved;
        this.sector;
        this.nbrPlayer;
        /*this.playerConnected = {};
        this.playerSaved = {};
        this.sector = {};
        this.nbrPlayer = 0;*/
    }

    connection(player,socket){
        var obj = {};
        obj.connected = false;
        for (let [key, value] of Object.entries(this.playerSaved)) {
            if(this.playerSaved[key].n == player.n) {
                var decrypt = this.decryptPassword(this.playerSaved[key].mdp,player.mdp).then((value) => {
                    console.log(value);
                    obj = this.connectionValidate(player,socket,value,obj);
                })
                break;
            }
        }
        return obj;
    }

    connectionValidate(player,socket,decrypt,obj){
        if(decrypt == true){
            this.playerConnected[key] = Object.assign(new Player(), this.playerSaved[key]);
            this.playerConnected[key].socket;//put socket in object player
            obj = this.playerConnected[key];
            obj.connected = true;
            this.actionSocket(this.playerConnected[key])//send connection at all player sector
            return obj;
        }
    }

    disconnection(player){
        if(player.id != 0){
            if(this.playerConnected[player.id]){
                delete this.playerConnected[player.id];
                delete this.sector[player.s].players[player.id]
            }
        }
    }

    async hashPassword (hash) {
      
        const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(hash, 10, function(err, hashed) {
                    if (err) reject(err);
                    resolve(hashed);
                })
        })
        return hashedPassword;
    }

    async decryptPassword (hash,notHashed) {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.compare(hash.toString(), notHashed.toString(), function(err, result) {
                if (err) reject(err);
                resolve(result);
            })
        })
        return hashedPassword;
    }


    subscribe(player,socket){
        var exist = false;
        if(this.nbrPlayer == undefined)
            this.nbrPlayer = 0;
        for (let [key, value] of Object.entries(this.playerSaved)) {
            if(this.playerSaved[key].n == player.n){
                exist = true;
                break;
            }
        }
        if(exist == false){
            this.nbrPlayer += 1
            var playerCreate = new Player();
            playerCreate.id = this.nbrPlayer;
            playerCreate.n = player.n;
            this.hashPassword(player.mdp)
            .then((value) => {
                playerCreate.mdp = value;
                playerCreate.s = 0;
                playerCreate.x = 0;
                playerCreate.y = 0;
                playerCreate.z = 0;
                playerCreate.socket = socket;
                this.playerConnected[playerCreate.id] = Object.assign(new Player(), playerCreate);
                this.playerSaved[playerCreate.id] = Object.assign(new Player(), playerCreate);
                playerCreate.mdp = player.mdp;
                this.connection(playerCreate,socket);
            });
        }else{
            return false;
        }
        
    }

    move(player){
        if(this.playerConnected[player.id]){
            this.playerConnected[player.id].move(player);
            this.savePlayer(player);
        }
    }

    shoot(player){
        if(this.playerConnected[player.id]){
            this.playerConnected[player.id].shoot(player);
            this.savePlayer(player);
        }
    }

    stopShoot(player){
        if(this.playerConnected[player.id]){
            this.playerConnected[player.id].stopShoot(player);
            this.savePlayer(player);
        }
    }

    putObject(player){
        if(this.sector[player.s]){
            if(!this.sector[player.s].obj)
                this.sector[player.s].obj = {};
                this.sector[player.s].nbrObj = 0;
            let len = this.sector[player.s].nbrObj;
            player.po.id = len;
            this.sector[player.s].obj.len = player.po;
            this.savePlayer(player);
            for (let [key, value] of Object.entries(this.sector[player.s].players)) {
                if(this.sector[player.s].players[key].socket && this.sector[player.s].players[key].id != player.id){
                    this.sector[player.s].players[key].socket.emit('addObject' , {resp : this.sector[player.s].obj.len})
                }
            }
            this.sector[player.s].nbrObj++
        }
    }

    takeObject(player){
        if(this.sector[player.s]){
            this.savePlayer(player);
            for (let [key, value] of Object.entries(this.sector[player.s].players)) {
                if(this.sector[player.s].players[key].socket && this.sector[player.s].players[key].id != player.id){
                    this.sector[player.s].players[key].socket.emit('takeObject' , {resp : this.sector[player.s].obj[player.po.id]})
                }
            }
            delete this.sector[player.s].obj[player.po.id];
        }
    }

    allObject(player){
        if(this.sector[player.s]){
            for (let [key, value] of Object.entries(this.sector[player.s].players)) {
                if(this.sector[player.s].players[key].socket && this.sector[player.s].players[key].id != player.id){
                    this.sector[player.s].players[key].socket.emit('allObject' , {resp : this.sector[player.s].obj})
                }
            }
        }
    }

    changeSector(player){
        if(this.playerConnected[player.id]){
            delete this.sector[player.ls].players[player.id] //delete current player of last sector
            for (let [key, value] of Object.entries(this.sector[player.ls].players)) {//send info of deleted player at last sector
                if(this.sector[player.ls].players[key].socket && this.sector[player.ls].players[key].id != player.id){
                    this.sector[player.ls].players[key].socket.emit('action' , {resp : this.playerConnected[player.id]})
                }
            }
            this.playerConnected[player.id].s = player.ns; //new sector
            player.s = player.ns;
            this.savePlayer(player);
        }
        this.allObject(player);
        this.actionSocket(player);
    }

    actionSocket(player){
        if(!this.sector[player.s])//create sector if not exist
            this.sector[player.s] = {};
        if(!this.sector[player.s].players)//create array players if not exist
            this.sector[player.s].players = {};
        if(player.a == 1)//action move
            this.move(player)
        if(player.a == 2)//action shoot
            this.shoot(player)
        if(player.a == 3)//action stop shoot
            this.stopShoot(player)
        if(player.a == 10)//action put object
            this.putObject(player)
        if(player.a == 11)//action take object
            this.takeObject(player)
        this.sector[player.s].players[player.id] = this.playerConnected[player.id];
        if(player.a < 10){
            for (let [key, value] of Object.entries(this.sector[player.s].players)) {
                if(this.sector[player.s].players[key].socket && this.sector[player.s].players[key].id != player.id){
                    this.sector[player.s].players[key].socket.emit('action' , {resp : this.playerConnected[player.id]})
                }
            }
        }

    }

    savePlayer(player){
        socket = this.playerConnected[player.id].socket;
        this.playerConnected[player.id].socket = {};
        this.playerSaved[player.id] = this.playerConnected[player.id];
        this.playerConnected[player.id].socket = socket;
    }

    saveAll(){
        this.playerConnected = {};
        try {
            let data = JSON.stringify(this);
            fs.writeFile('universe.json', data, (err) => {
                if (err) throw err;
                console.log('Data written to file');
            });
        } catch (err) {
            console.error(err);
        }
    }

    loadAll(){
        fs.readFile('universe.json', (err, data) => {
            if (err) throw err;
            var dataNow = JSON.parse(data);
            this.playerConnected = dataNow.playerConnected;
            this.playerSaved = dataNow.playerSaved;
            this.sector = dataNow.sector;
            this.nbrPlayer = dataNow.nbrPlayer;
        });
    }
}

module.exports = Universe;