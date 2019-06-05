const request = require('https').request


class Scrapper {
    constructor(article) {
        this.requestOpts = {
            hostname: "en.wikipedia.org",
            method: 'GET',
            port: 443,
            path: `/wiki/${article}`
        }
    }

    scrape() {
        return new Promise((resolve, reject) => {
            const req = request(this.requestOpts, res => {
                let data = ''
                res
                    .on('error', reject)
                    .on('data', chunk => {
                        data += chunk
                    })
                    .on('end', () => {
                        resolve(data)
                    })

            })
            req.on('error', reject).end()
        })

    }
}

module.exports = (article) => {
    return new Scrapper(article)
}
