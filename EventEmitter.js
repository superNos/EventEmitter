(function () {
  
  function isValidListener (listener) {
    if (typeof listener === 'function') {
      return true;
    } else if (listener && typeof listener === 'object') {
      return isValidListener(listener.listener);
    } else {
      return false;
    }
  }

  function indexOf (events, listener) {
    if (typeof listener === 'object') {
      listener = listener.listener;
    }
    var index = -1;
    for (var i = 0; i < events.length; i ++) {
      if (events[i].listener === listener) {
        index = i;
        break;
      }
    }
    return index;
  }

  function EventEmitter () {
    this._events = {}
  }

  var proto = EventEmitter.prototype
  
  proto.on = function (event, listener) {
    if (!event || !listener) return;
    if (!isValidListener(listener)) return;
    var events = this._events[event] = this._events[event] || [];
    if (indexOf(events, listener) != -1) return;
    if (typeof listener === 'function') {
      events.push({
        listener: listener,
        once: false
      });
    } else {
      events.push(listener);
    }
    return this
  }

  proto.once = function (event, listener) {
    this.on(event, {
      listener: listener,
      once: true
    })
    return this
  }

  proto.off = function (event, listener) {
    if(!event || !listener) return;
    if (!this._events[event]) return;
    var events = this._events[event]
    var index = indexOf(events, listener);
    if (index === -1) return;
    events.splice(index, 1);
    return this;
  }

  proto.emit = function (event, args) {
    if (!event) return;
    if (!this._events[event]) return;
    var listents = this._events[event];
    for (var i = 0; i < listents.length; i ++) {
      listents[i].listener.apply(this, args || []);
      if (listents[i].once) {
        listents.splice(i, 1);
      }
    }
    return this;
  }

  proto.allOff = function (event) {
    if (event && this._events[event]) {
      this._events[event] = [];
    } else {
      this._events = {}
    }
    return this;
  }

  window.EventEmitter = EventEmitter;

})()