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

    connection(player){
        var obj;
        obj.connected = false;
        for (let [key, value] of Object.entries(this.playerSaved)) {
            if(key.n == player.n && key.mdp == player.mdp){
                obj = key;
                break;
            }
            //console.log(`${key}: ${value}`);
        }
        if(obj.connected != false)
            this.playerConnected[player.id] = obj;
        return obj;
    }

    disconnection(player){
        if(player.id != 0){
            if(this.playerConnected[player.id])
                delete this.playerConnected[player.id];
        }
    }

    subscribe(player){
        var exist = false;
        if(this.nbrPlayer == undefined)
            this.nbrPlayer = 0
        for (let [key, value] of Object.entries(this.playerSaved)) {console.log(key)
            if(key.n == player.n){
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
            this.playerConnected[playerCreate.id] = playerCreate;
            this.playerSaved[playerCreate.id] = playerCreate;
        }else{
            return false;
            //this.connection(player);
        }
        
    }

    move(player){
        var obj = {};
        if(this.playerConnected[player.id]){
            this.playerConnected[player.id].move(player);
            this.savePlayer(player)
        }
        obj = this.returnAllPlayerInSector(player);
        return obj;
    }

    returnAllPlayerInSector(player){
        if(!this.sector[player.s])//create sector if not exist
            this.sector[player.s] = {};
        if(!this.sector[player.s].players)//create array players if not exist
            this.sector[player.s].players = {};
        this.sector[player.s].players[player.id] = player;
        return this.sector[player.s].players
    }

    interact(player){

    }

    savePlayer(player){
        this.playerSaved[player.id] = this.playerConnected[player.id];
    }

    saveAll(){
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