const Game = require('./lib')

let game = new Game('Wikipedia:Wiki Game', 'Austro-Hungarian Compromise of 1867')

game.find()
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    })
