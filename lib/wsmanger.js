/**
 * websocket管理器
 */

export default class WSManager {
    /**
     * Initialize a new `WSManager`.
     *
     * @api public
     */
    constructor(url, protocols = [], options = {}) {
        this.url = url
        this.protocols = protocols
        this.websocket = null
        this.reconnectLock = false // 心跳检测频率锁
        this.beatTime = 60000 // 心跳频率
        this.timeout = 10000 // 重连频率
        this.heartTimer = null
        this.closeTimer = null
        this.responseHandler = {}
        Object.keys(options).forEach(key => {
            this[key] = options[key]
        })
        this.initWebsocket()
    }


    /**
     * Init websocket
     * 
     * @api private
     */
    initWebsocket() {
        try {
            this.websocket = new WebSocket(this.url, this.protocols)
            this.initEventHandle();
        } catch (e) {
            this.reconnect();
        }
    }
    
    /**
     * InitEvent Handler
     * 
     * @api public
     */
    initEventHandle() {
        this.websocket.onclose =  () => {
            console.log('onclose')
            this.reconnect();
        };
        this.websocket.onerror = () => {
            console.log('onerror')
            this.reconnect();
        };
        this.websocket.onopen = () => {
            //心跳检测重置
            console.log('onopen')
            this.heartCheck()
        };
        this.websocket.onmessage = (evt) => {
            //心跳检测重置
            console.log('onmessage', evt.data)
            this.heartCheck()
        }
    }
    /**
     * Reconnect Handler
     * 
     * @api private
     */
    reconnect() {
        if(this.reconnectLock) return
        this.reconnectLock = true
        setTimeout(() => {
            console.log('try reconnect')
            this.initWebsocket()
            this.reconnectLock = false
        }, this.timeout)

    }
    /**
     * heartCheck Handler
     * 
     * @api private
     */
    heartCheck() {
        console.log('clearTime')
        clearTimeout(this.closeTimer);
        clearTimeout(this.heartTimer );
        this.heartTimer = setTimeout(() => {
            console.log('heartCheck')
            this.websocket.send(1);
            this.closeTimer = setTimeout(() => {
                this.websocket.close()
                this.websocket = null
            }, this.beatTime)
        }, this.beatTime)
    }
}