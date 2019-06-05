const scrapper = require('../scrapper')
const parser = require('../parser')

class Spider {
    constructor(article) {
        this.article = article
        this.parser = parser({
            trim: true,
            normalize: true,
            lowercase: true
        })
    }

    startSpider() {
        return new Promise((resolve, reject) => {
            scrapper(this.article).scrape()
                .then(html => {
                    return this.parser.parse(html)
                })
                .then(resolve)
                .catch(reject)
        })
    }
}

module.exports = (article) => {
    return new Spider(article)
}
