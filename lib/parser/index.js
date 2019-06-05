/**
 *   Parser Class
 */

const sax = require("sax")

class Parser {
    /**
     * constructor - parser constructor
     *
     * @param  {object} saxOpts   options used by sax parser
     * @param  {object} catchTags tags to be processed by the parser
     * @return {object}           new parser instance
     */
    constructor(saxOpts) {
        this.opts = saxOpts
        this.opts.trim = this.opts.trim || true
        this.opts.normalize = this.opts.normalize || true
        this.opts.lowercase = this.opts.lowercase || true
        this.strict = false // HTML-mode
        this.parser = sax.parser(this.strict, this.opts)
    }


    /**
     * parse - parse html content
     *
     * @param  {string} html html string to be parsed
     * @return {Promise<articles>} A promise to the articles.
     */
    parse(html) {
        let articles = [] // articles array to be returned
        let startParse = false // indicator for start parsing
        return new Promise((resolve, reject) => {
            this.parser.onerror = reject // reject errors

            this.parser.onopentag = (tag) => {
                // parse all info inside wikipedia page tag with id=content
                if(tag.attributes) {
                    if(tag.attributes.id === "mw-content-text")
                        startParse = true
                    if(["footer", "mw-navigation", "catarticles"].includes(tag.attributes.id))
                        startParse = false
                }

                if(!startParse) return // skip non content containers
                if(tag.name != 'a') return // skip non article tags


                if(tag.attributes && tag.attributes.href) {
                    if(tag.attributes.href.indexOf('Category') >= 0) return // skip category links
                    if(tag.attributes.href.indexOf('/wiki/') === 0) {
                        let article = tag.attributes.href.split('/wiki/')[1]
                        articles.push(article) // push articles in an array to be resolved
                    }
                }

            }

            this.parser.onend = () => {
                resolve(articles) // resolve articles
            }

            // start parsing the html string then close the stream
            this.parser.write(html).close()
        })
    }
}

module.exports = (saxOpts, catchTags) => {
    // export singleton instance from parser class
    return new Parser(saxOpts, catchTags)
}
