class Universe {

    constructor(){
        this.playerConnected = {};
        this.playerSaved = {};
        this.sector = {};
        this.nbrPlayer;
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
        return obj;
    }

    subscribe(player){
        var exist = false;
        if(this.nbrPlayer == undefined)
            this.nbrPlayer = 0
        for (let [key, value] of Object.entries(this.playerSaved)) {
            if(key.n == player.n){
                exist = true;
                break;
            }
            //console.log(`${key}: ${value}`);
        }
        if(exist == false){
            this.nbrPlayer += 1
            var player = {};
            player.id = this.nbrPlayer;

        }
        
    }

    move(player){
        var obj = {};
        if(this.playerConnected[player.id])
            this.playerConnected[player.id].move(player);
        obj = this.returnAllPlayerInSector(player);
        return obj;
    }

    returnAllPlayerInSector(player){
        if(!this.sector[player.s])//create sector if not exist
            this.sector[player.s] = {};
        if(!this.sector[player.s].players)//create array players if not exist
            this.sector[player.s].players = {};
        this.sector[player.s].players[player.id] = player;
        return this.sector[player.s]
    }

    interact(player){

    }
}