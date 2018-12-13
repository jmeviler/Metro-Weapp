export default class Extensions {
  static last = (array) => {
    if (array && array.length) {
      return array[array.length - 1]
    }

    return undefined
  }

  static contain = (array, item, key) => {
    let index = -1
    if (key) {
      index = array.findIndex(element => element[key] === item[key])
    } else {
      index = array.findIndex(element => element === item)
    }

    if (index < 0) {
      return false
    }

    return true
  }

  static pick = (object, keys) => {
    const res = {}
    for (const key in object) {
      if (Extensions.contain(keys, key)) {
        res[key] = object[key]
      }
    }

    return res
  }

  static debounce = (func, wait, options = { immediate: false, tail: true }) => {
    let timeout
    let result

    const debounce = function (...args) {
      const context = this
      if (timeout) {
        clearTimeout(timeout)
      }
      if (options.immediate) {
        const callNow = !timeout
        timeout = setTimeout(() => {
          timeout = null
          if (options.tail) {
            result = func.apply(context, args)
          }
        }, wait)

        if (callNow) {
          result = func.apply(context, args)
        }
      } else {
        timeout = setTimeout(() => {
          func.apply(context, args)
        }, wait)
      }
      return result
    }

    return debounce
  }

  static isArray = (array) => {
    return Object.prototype.toString.call(array) === '[object Array]'
  }
}
