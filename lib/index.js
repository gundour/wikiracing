const EventEmitter = require('events')
const spider = require('./spider')
const Tree = require('./tree')

class Game extends EventEmitter {
    constructor(startArticle, endArticle) {
        super()
        this.startArticle = startArticle
        this.endArticle = endArticle
        this.clicks = 0
        this.tree = new Tree()
        this.articles = []
        this.listeners = {}
        this.done = false
    }

    addEventListeners() {
        this.listeners.end = () => {
            this.articles = []
            this.done = true
            this.emit('data', {
                clicks: this.clicks,
                tree: this.tree
            })
        }
    }

    removeEventListeners() {
        Object.keys(this.listeners).forEach(listener => {
            this.removeListener(listener, this.listeners[listener])
            delete this.listeners[listener]
        })
    }

    async growTree(article, parent) {
        let tree = new Tree() // create new articles tree
        if(!tree.root) tree.add(article) // add root node if no root is found

        // find children articles and add them to parent
        let subArticles = []
        try {
            subArticles = await spider(article).startSpider()
            subArticles.forEach(subArticle => {
                tree.add(subArticle, article)
                this.articles.push(subArticle)
            })
            this.tree.addNode(tree.root, parent)
        } catch(err) {
            throw err
        }

        if(article === this.endArticle) {
            this.articles = []
            this.emit('end')
        }

        return tree.root
    }

    async orchestrate(startArticle, parent) {
        this.addEventListeners()
        this.on('end', this.listeners.end)
        if(this.done) return

        if(!startArticle) startArticle = this.startArticle
        if(!parent) parent = {}

        try {
            this.clicks++ // increase clicks by 1
            parent = await this.growTree(startArticle, parent)

            while(this.articles.length) {
                this.removeEventListeners()
                let currentArticle = this.articles.shift()
                await this.orchestrate(currentArticle, parent)
            }
        } catch(err) {
            this.emit('error', err)
        }
    }
}

module.exports = Game
