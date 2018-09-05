class Promise_me {
    constructor(func) {
        this.__success_res  = null
        this.__fail_res = null
        this.__status = ''
        this.__queue = []
        const __this = this
        func(function (...args) {
            __this.__success_res = args
            __this.__status = 'success'
            __this.__queue.forEach(obj => {
                obj.resolve(...args)
            })

        }, function (...args) {
            __this.__fail_res = args
            __this.__status = 'fail'
            __this.__queue.forEach(obj => {
                obj.reject(...args)
            })
        }
        )
    }
    then(resolve, reject) {
        if(this.__status === 'suceess') {
            resolve(...this.__success_res)
        }else if(this.__status === 'fail') {
            reject(...this.__fail_res)
        }else {
            this.__queue.push({resolve, reject})
        }
            
    }
    static all(arr) {
        let allRes = []
        return new Promise_me((resolve, reject) => {
            let i = 0;
            next()
            function next() {
                arr[i].then( res => {
                    i++
                    allRes.push(res)
                    if(i == arr.length) {
                        resolve(allRes)
                    }else {
                        next()
                    }
                }, reject)
                
            }
        })
    }
}
