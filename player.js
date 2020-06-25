var Ship = require('./ship.js');

class Player {

    constructor(){
        this.s; //sector // 0
        this.id; //id // 0
        this.n; //name // ''
        this.mdp; //mdp // ''
        this.x;
        this.y;
        this.z;
        this.h; //hangar ship// {}
        this.w; //weapon // 0
        //animation
        this.ar; //animation reload // 0
        this.as; //animation shoot // 0
        this.ap; //animation punch // 0
        this.aj; //animation jump // 0
        this.socket;
    }

    returnHangar(){
        return this.h;
    } 
    
    returnPos(){
        var obj = {};
        obj.x = this.x;
        obj.y = this.y;
        obj.z = this.z;
        return obj
    }

    compareSector(s){
        if(this.s == s)
            return true
        return false
    }

    move(player){
        this.x = player.x;
        this.y = player.y;
        this.z = player.z;
        if(this.sn != 0){
            this.sn.move(player)
        }
    }

    shoot(player){
        this.as = player.as;
    }

    jump(player){
        this.aj = player.aj;
    }

    newShip(ship){
        let len = Object.keys(this.h).length();
        this.h[len+1] = ship;
    }

    getInShip(player){
        if(this.h[player.sn])
            this.sn = this.h[player.sn];//ship Now
    }

    getOutShip(player){
        this.sn = 0;//ship Now
    }

    stopShoot(player){
        this.as = player.as;
    }

}

module.exports = Player;
