const Game = require('./lib')

let game = new Game('Wikipedia:Wiki Game', 'Austro-Hungarian Compromise of 1867')

game.find()
    .then(article => {
        let route = article.getLinkRoute()
        console.log('Article route', route);
    })
    .catch(err => {
        console.log(err);
    })
