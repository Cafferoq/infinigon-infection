var Infinigon = require('infinigon');
var Board = Infinigon.Board;
var Piece = Infinigon.Piece;

//a variable for the amount of hits a zombie can take.
var MAX_ZOMBIE_LIFE = 5;
//a variable for whether or not there is friendly fire.
var FRIENDLY_FIRE = false;

var ZOMBIE_SPEED = 3;

var HUMAN_SPEED = 2;

//keeps whether or not a first infected has been picked.
var currInfection = false;

function Infection(){

    var options = {
        size:{
            width: 3000,
            height: 3000
        }
    };
    //until this is called, the pieces and board will render but not move.
    //this.game.start();
    this.game = new Infinigon(options);
    this.game.start();
    this.game.onCollision = this.handleCollision;
}



Infection.prototype.newPlayer = function(id) {
    var options = {
        id: id,
        board: this.game.board,
        position: {
            x: 1500,
            y: 2500
        },
        class: 'human piece',
        speed: HUMAN_SPEED
    };
    var returned = new Piece(options);
    returned.life = MAX_ZOMBIE_LIFE;
    if (!currInfection){
        currInfection = true;
        zombieSpawn(returned);
    }
    return returned;
};

Infection.prototype.removePlayer = function(id){
    this.game.board.pieces[id].deconstruct();
};

Infection.prototype.handleCollision = function(pieceA,pieceB){
    if((pieceA).class.indexOf("human") > -1) {
        if (pieceB.class.indexOf("zombie") > -1) {
            zombieSpawn(pieceA);
        } else if (FRIENDLY_FIRE && pieceB.class.indexOf("projectile") > -1) {
            pieceA.life--;
            if(pieceA.life <1)
                zombieSpawn(pieceA);
        }
    }else if(pieceA.class.indexOf("projectile")>-1){
        if (pieceB.class.indexOf(("zombie"))){
            pieceB.life--;
            if(pieceB.life < 1)
                zombieSpawn(pieceB);

        } else if (FRIENDLY_FIRE && pieceB.class.indexOf("human")>-1){
            pieceB.life--;
            if(pieceB.life < 1)
                zombieSpawn(pieceB);
        }
    }else if(pieceA.class.indexOf("zombie")){
        if (pieceB.class.indexOf("projectile")>-1){
            pieceA.life--;
            if(pieceA.life <1)
                zombieSpawn(pieceA);
        }else if (pieceB.class.indexOf("human")) {
            zombieSpawn(pieceB);
        }
    }

};

function zombieSpawn(piece){
    piece.setPosition({"x":30,"y":30});
    piece.speed = ZOMBIE_SPEED;
    piece.life = MAX_ZOMBIE_LIFE;
    piece.class = "zombie piece";
}

module.exports = Infection;