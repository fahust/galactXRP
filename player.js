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
    }

    shoot(player){
        this.as = player.as;
    }

    stopShoot(player){
        this.as = player.as;
    }

}

module.exports = Player;
