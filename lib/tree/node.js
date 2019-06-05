
/**
 * Tree node class
 */

class node {
    constructor(data, parent) {
        this.data = data
        this.parent = parent || null // null for root node
        this.children = []
    }
}

module.exports = node
