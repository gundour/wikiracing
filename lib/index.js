const EventEmitter = require('events')
const Article = require('./article')
const _ = require('lodash')
const {limitedParallel, StopPipe} = require('promises-pipes')


class Game extends EventEmitter {
    constructor(startArticle, endArticle) {
        super()
        this.startArticle = new Article(startArticle)
        this.endArticle = endArticle
        this.queue = [ [this.startArticle.getLinks, this.startArticle, this.endArticle] ] // articles queue to be requested
    }

    processQueue() {
        limitedParallel(this.queue, 4, (res) => {
            return (res instanceof Article)
        })
        .then(results => {
            results = _.flatten(results)
            this.queue = results
            return this.processQueue()
        })
        .catch(err => {
            if(err instanceof StopPipe) {
                return this.emit('found', err.stopResponse)
            }
            this.emit('error', err)
        })
    }

    find() {
        return new Promise((resolve, reject) => {
            this.on('found', resolve)
            this.on('error', reject)

            this.processQueue()
        })
    }
}

module.exports = Game
