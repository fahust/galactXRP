var Player = require('./player.js');
const fs = require('fs');

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
            if(this.playerSaved[key].n == player.n && this.playerSaved[key].mdp == player.mdp){
                this.playerConnected[key] = Object.assign(new Player(), this.playerSaved[key]);
                this.playerConnected[key].socket;
                obj = this.playerConnected[key];
                obj.connected = true;
                break;
            }
        }
        return obj;
    }

    disconnection(player){
        if(player.id != 0){
            if(this.playerConnected[player.id]){
                delete this.playerConnected[player.id];
                delete this.sector[player.s].players[player.id]
            }
        }
    }

    subscribe(player,socket){
        var exist = false;
        if(this.nbrPlayer == undefined)
            this.nbrPlayer = 0
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
            playerCreate.mdp = player.mdp;
            playerCreate.s = 0;
            playerCreate.x = 0;
            playerCreate.y = 0;
            playerCreate.z = 0;
            playerCreate.socket = socket;
            this.playerConnected[playerCreate.id] = playerCreate;
            this.playerSaved[playerCreate.id] = playerCreate;
            this.connection(playerCreate,socket)
        }else{
            return false;
        }
        
    }

    move(player){
        var obj = {};
        if(this.playerConnected[player.id]){
            this.playerConnected[player.id].move(player);
            this.savePlayer(player);
        }
    }

    shoot(player){
        var obj = {};
        if(this.playerConnected[player.id]){
            this.playerConnected[player.id].shoot(player);
            this.savePlayer(player);
        }
    }

    stopShoot(player){
        var obj = {};
        if(this.playerConnected[player.id]){
            this.playerConnected[player.id].stopShoot(player);
            this.savePlayer(player);
        }
    }

    changeSector(player){
        var obj = {};
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
        this.sector[player.s].players[player.id] = this.playerConnected[player.id];
        for (let [key, value] of Object.entries(this.sector[player.s].players)) {
            if(this.sector[player.s].players[key].socket && this.sector[player.s].players[key].id != player.id){
                this.sector[player.s].players[key].socket.emit('action' , {resp : this.playerConnected[player.id]})
            }
        }

    }

    /*returnAllPlayerInSector(player){
        if(!this.sector[player.s])//create sector if not exist
            this.sector[player.s] = {};
        if(!this.sector[player.s].players)//create array players if not exist
            this.sector[player.s].players = {};
        this.sector[player.s].players[player.id] = player;
        return this.sector[player.s].players
    }*/

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