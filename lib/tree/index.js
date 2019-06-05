/**
 * Tree Class
 */

const Node = require('./node')

class Tree {
    constructor() {
        this.root = null
    }

    addNode(node, parent) {
        parent = parent ? this.findBFS(parent.data) : null

        if (this.contains(node.data)) return

        if (parent) {
            parent.children.push(node)
        } else {
            if (!this.root) {
                this.root = node
            }
        }
    }

    add(data, parent) {
        let node = new Node(data)
        parent = parent ? this.findBFS(parent) : null

        if (this.contains(data)) return

        if (parent) {
            parent.children.push(node)
        } else {
            if (!this.root) {
                this.root = node
            }
        }
    }

    contains(data) {
        return this.findBFS(data) ? true : false
    }

    findBFS(data) {
        if (!this.root) return null
        let queue = [this.root]
        while (queue.length) {
            let node = queue.shift()
            if (node.data === data) {
                return node
            }
            for (let i = 0; i < node.children.length; i++) {
                queue.push(node.children[i])
            }
        }
        return null
    }

    print() {
        if (!this.root) {
            return console.log('No root node found')
        }
        let newline = new Node('\n')
        let queue = [this.root, newline]
        let string = ''
        while (queue.length) {
            let node = queue.shift()
            string += node.data.toString() + (node.data !== '\n' ? ' ' : '')
            if (node === newline && queue.length) {
                queue.push(newline)
            }
            for (var i = 0; i < node.children.length; i++) {
                queue.push(node.children[i])
            }
        }
        console.log(string.slice(0, -2).trim())
    }

}

module.exports = Tree
