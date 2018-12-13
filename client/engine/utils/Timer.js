export default class Timer {
  static setInterval = (func, interval, timeoutRef = {}) => {
    timeoutRef.id = setTimeout(() => {
      if (func.length > 0) {
        const next = () => Timer.setInterval(func, interval, timeoutRef)
        func(next)
      } else {
        Timer.setInterval(func, interval, timeoutRef)
        func()
      }
    }, interval)
    const clearHandle = () => {
      clearTimeout(timeoutRef.id)
    }

    return clearHandle
  }

  static clearInterval = (clearHandle) => {
    if (clearHandle) {
      clearHandle()
    }
  }
}
