const request = require('https').request

class Request {
    constructor() {
        this.requestOpts = {
            hostname: "en.wikipedia.org",
            method: 'GET',
            port: 443
        }
        this.page = ''
    }

    get(article) {
        let path = `/w/api.php?action=parse&format=json&redirects=true&prop=links&page=`
        return new Promise((resolve, reject) => {
            if(!article) return reject(new Error('No article specified'))

            this.requestOpts.path = path + article

            const req = request(this.requestOpts, res => {
                let data = ''
                res
                    .on('error', reject)
                    .on('data', chunk => {
                        data += chunk
                    })
                    .on('end', () => {
                        if(res.statusCode != 200) return reject(data)
                        // data response
                        try {
                            resolve(JSON.parse(data))
                        } catch(err) {
                            reject(err)
                        }
                    })

            })
            req.on('error', reject).end()
        })
    }
}


module.exports = () => {
    return new Request()
}
