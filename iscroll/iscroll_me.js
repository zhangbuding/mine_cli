class Iscroll_me {
    constructor(selector, options = {}) {
        this.__queue = {}
        function defaultValues(options, defaults) {
            for (let key in defaults) {
                if (typeof options[key] === 'undefined') {
                    options[key] = defaults[key]
                }
            }
        }
        defaultValues(options, {
            bounce: true,
            bounceTime: 600,
            freeScroll: false,
            scrollX: false,
            scrollY: true,
            startX: 0,
            startY: 0,
            moveScale: 0.3,
            directionLockThreshold: 5
        })

        this.__roots = Array.from(document.querySelectorAll(selector))
        this.__roots.forEach(root => {
            let child = root.children[0]
            if (!child) {
                return
            }
            let that = this
            let direction = ''
            let scrollStart
            let distanceX = 0, distanceY = 0
            let startX = 0, startY = 0
            let moveX = 0, moveY = 0
            let translateX = options.startX, translateY = options.startY
            child.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
            child.addEventListener('touchstart', start, false)
            child.addEventListener('touchmove', move, false)
            child.addEventListener('touchend', end, false)

            function start(e) {

                direction = ''
                child.style.transition = ''
                moveX = moveY = 0
                e.preventDefault()
                startX = e.targetTouches[0].clientX
                startY = e.targetTouches[0].clientY
                distanceX = startX - translateX
                distanceY = startY * options.moveScale - translateY

                that.emit('beforeScrollStart')
                scrollStart = true
            }
            function move(e) {
                moveX = e.targetTouches[0].clientX
                moveY = e.targetTouches[0].clientY
                if (!direction) {
                    if (options.scrollX && Math.abs(moveX - startX) > options.directionLockThreshold) {
                        direction = 'x'
                    } else if (options.scrollY && Math.abs(moveY - startY) > options.directionLockThreshold) {
                        direction = 'y'
                    }
                } else {
                    if (scrollStart) {
                        that.emit('scrollStart')
                        scrollStart = false
                    }
                    if (direction === 'x' || options.freeScroll) {
                        translateX = moveX - distanceX
                    }
                    if (direction === 'y' || options.freeScroll) {
                        translateY = moveY * options.moveScale - distanceY
                    }
                    that.x = translateX
                    that.y = translateY
                    if (options.bounce) {
                        child.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
                    }
                    that.emit('scroll')
                }

            }

            function end(e) {
                child.style.transition = `all ${options.bounceTime}ms ease`
                child.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
                if (translateX > 0) {
                    translateX = 0
                } else if (translateX < root.offsetWidth - child.offsetWidth) {
                    translateX = root.offsetWidth - child.offsetWidth
                } else if (translateY > 0) {
                    translateY = 0
                } else if (translateY < root.offsetHeight - child.offsetHeight) {
                    translateY = root.offsetHeight - child.offsetHeight
                } else {
                    that.emit('scrollEnd')
                }
                child.style.transition = `all ${options.bounceTime}ms ease`
                child.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
                child.addEventListener('transitionend', transitionend, false)
                function transitionend() {
                    child.style.transition = ''
                    child.removeEventListener('transitionend', transitionend, false)
                    that.emit('scrollEnd')
                }
                if (moveX === 0 && moveY === 0) {
                    that.emit('scrollCancel')
                }
            }
        })
    }
    on(eventname, fn) {
        if (!this.__queue[eventname]) {
            this.__queue[eventname] = []
        }
        this.__queue[eventname].push(fn)
    }
    emit(eventname) {
        if (this.__queue[eventname]) {
            this.__queue[eventname].forEach(fn => { fn() })
        }
    }

}