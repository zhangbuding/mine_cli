class Vue {
    // 模拟 vue 传参
    constructor(options) {
        this.__data = options.data || {}
        this.__root = document.querySelector(options.el)
        this.__e = new EventEmit()
        this.create()
        this.compile(this.__root.childNodes)
    }
    //  data 数据绑定到实例
    create() {
        Object.keys(this.__data).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return this.__data[key]
                },
                set(val) {
                    this.__data[key] = val
                    // 更改值发布事件
                    this.__e.emit(key)
                }
            })
        })
    }
    // 递归遍历 dom
    compile(childNodes) {
        if (childNodes.length <= 0) { return }
        childNodes.forEach(node => {
            switch (node.nodeType) {
                case 1:
                    if (node.nodeName === 'INPUT') {
                        let vmodel = node.attributes['v-model']
                        if (!vmodel) { return }
                        let attrName = vmodel.value.trim()
                        node.value = this.__data[attrName]
                        // 注册输入事件
                        node.oninput = () => this[attrName] = node.value

                        // 订阅
                        this.__e.on(attrName, () => node.value = this[attrName])
                    } else {
                        // 递归
                        this.compile(node.childNodes)
                    }
                    break
                case 3:
                    // 替换模版引擎
                    let matches = /{{(.+)}}/.exec(node.textContent)
                    if (matches) {
                        let attrName = matches[1].trim()
                        // 初次赋值
                        node.textContent = this.__data[attrName]
                        // 订阅
                        this.__e.on(attrName, () => node.textContent = this[attrName])
                    }
                    break

            }
        })
    }
}