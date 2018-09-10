class EventEmit {
    constructor() {
        // 回调
        this.__callbacks = {}
    }
    // 订阅方法
    on(eventName, fn) {
        if (!this.__callbacks[eventName]) {
            this.__callbacks[eventName] = []
        }
        this.__callbacks[eventName].push(fn)
    }
    // 发布方法
    emit(eventName, ...args) {
        if (!this.__callbacks[eventName]) {
            return
        }
        this.__callbacks[eventName].forEach(fn => {
            fn(...args)
        })
    }
}

