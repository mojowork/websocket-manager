import WXManager from './wsmanger'

/**
 * Initialize a singleton instance.
 *
 * @api public
 */
const createWXManager = (function () {
    let instance
    return function (...args) {
        if (!instance) {
            instance = createProxyWXManager(...args)
        }
        return instance
    }
})()

/**
 * Proxy for WXManager instance.
 *
 * @api public
 */
function createProxyWXManager(...args) {
    let instance = new WXManager(...args)
    return new Proxy(instance, handler)
}

/**
 * Proxy handler
 *
 * @api public
 */
let handler = {
    get(target, property) {
        if (!['reconnectLock', 'heartTimer', 'closeTimer'].includes(property)) {
            return target[property]
        }
    },
    set() {
       
    }
}


export default createWXManager