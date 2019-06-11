const request = require('./request')()

class Article {
    constructor(name, parent) {
        this.name = name
        this.parent = parent || null
        this.links = []
    }

    getLinkRoute(route, article) {
        if(!route) route = []
        if(!article) article = this

        route.push(article.name)

        if(!article.parent) return route

        return this.getLinkRoute(route, article.parent)
    }

    getLinks(self, target) {
        return new Promise((resolve, reject) => {
            let url = self.name.split(' ').join('_')

            console.log(`calling ${self.name}`);
            let queue = []
            request.get(url)
                .then(response => {
                    if(!response || !response.parse || !response.parse.links) return resolve(queue)

                    let targetArticle

                    response.parse.links.forEach(link => {
                        if(self.name.indexOf(link['*']) === 0) return // skip disambiguation links
                        if(link['ns'] != 0) return // skip links outside the article
                        // skip date or number links
                        try {
                            let number = parseInt(link['*'])
                            if(number) return
                        } catch(err) {
                            return
                        }

                        let article = new Article(link['*'], self)

                        queue.push([article.getLinks, article, target])
                        self.links.push(article) // push link to article links

                        // link is found
                        if(link['*'].toLowerCase() === target.toLowerCase()) {
                            targetArticle = article
                        }
                    })

                    if(targetArticle) {
                        return resolve(targetArticle)
                    }

                    resolve(queue)
                })
                .catch(err => {
                    console.log(err);
                    resolve(queue)
                })
        })
    }
}

module.exports = Article
