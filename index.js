const Game = require('./lib')

let game = new Game('Wikipedia:Wiki_Game', 'World_Wide_Web')

game.orchestrate()


game.on('data', data => {
    console.log(data);
    data.tree.print()
})

game.on('error', err => {
    console.log(err);
})
