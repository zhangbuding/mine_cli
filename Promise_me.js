class Promise_me {
    constructor(func) {
        this.__status = ''
        this.__res = {
            resolve: null,
            reject: null
        }
        this.__queue = []
        func((...args) => {
            this.callback('resolve',args)
        }, (...args) => {
            this.callback('reject',args)

        })
    }
    then(resolve, reject) {
        if (this.__status === 'success') {
            resolve(this.__res.resolve)
        } else if (this.__status === 'fail') {
            reject(this.__res.reject)
        } else {
            this.__queue.push({ resolve, reject })
        }
    }
    callback(param, args) {
        this.__status = param
        this.__res[param] = args
        this.__queue.forEach(fn => fn[param](...args))
    }
    static all(arr) {
        return new Promise_me((resolve, reject) => {
            let arrRes = []
            let i = 0;
            (function next() {
                arr[i].then( res_resolve => {
                    arrRes.push(res_resolve)
                    i++
                    i === arr.length ?  resolve(arrRes) : next()
                }, res_reject => {
                    reject(res_reject)
                })  
            })()
        })

    }
}
