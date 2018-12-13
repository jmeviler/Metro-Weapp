export default class EventEmitter {
  static Events = {
    TAB_BAR_STATUS_CHANGED: 'tab-bar-status-changed',
    SETTING_INITIALIZED: 'setting-initialized',
  }

  static _stores = {}

  static addListener = (event, fn, ctx) => {
    if (typeof fn !== 'function') {
      throw new TypeError('fn must be a function')
    }

    EventEmitter._stores[event] = EventEmitter._stores[event] || []
    EventEmitter._stores[event].push({ block: fn, ctx })
  }

  static emit = (event, data) => {
    let store = EventEmitter._stores[event]
    if (store) {
      store = store.slice(0)
      for (let i = 0, len = store.length; i < len; i++) {
        store[i].block.call(store[i].ctx, data)
      }
    }
  }

  static removeListener = (event, fn) => {
    if (!arguments.length) {
      EventEmitter._stores = {}
      return
    }

    const store = EventEmitter._stores[event]
    if (!store) return

    if (arguments.length === 1) {
      delete EventEmitter._stores[event]
      return
    }

    for (let i = 0, len = store.length; i < len; i++) {
      const { block } = store[i]
      if (block === fn) {
        store.splice(i, 1)
        break
      }
    }
  }
}
