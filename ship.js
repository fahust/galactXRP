class Ship {

    constructor(){
        this.s; //sector // 0
        this.o; //id owner
        this.n; //name // ''
        this.x;
        this.y;
        this.z;
        this.t; //type // 0
        this.w; //weapon // 0
        //animation
        this.as; //animation shoot // 0
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

}

