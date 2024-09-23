// signals.js
class SignalBinding {
  constructor(signal, listener, isOnce, context, priority) {
    this._listener = listener;
    this._isOnce = isOnce;
    this.context = context;
    this._signal = signal;
    this._priority = priority || 0;
    this.active = true;
    this.params = null;
  }

  execute(paramsArr) {
    if (this.active && this._listener) {
      const params = this.params ? this.params.concat(paramsArr) : paramsArr;
      const result = this._listener.apply(this.context, params);
      if (this._isOnce) this.detach();
      return result;
    }
  }

  detach() {
    if (this.isBound()) {
      this._signal.remove(this._listener, this.context);
    }
  }

  isBound() {
    return !!this._signal && !!this._listener;
  }

  isOnce() {
    return this._isOnce;
  }

  _destroy() {
    delete this._signal;
    delete this._listener;
    delete this.context;
  }
}

class Signal {
  constructor() {
    this._bindings = [];
    this._prevParams = null;
    this.memorize = false;
    this.active = true;
    this._shouldPropagate = true;
  }

  _registerListener(listener, isOnce, context, priority) {
    const index = this._indexOfListener(listener, context);
    if (index !== -1) {
      const binding = this._bindings[index];
      if (binding.isOnce() !== isOnce) {
        throw new Error(`You cannot add${isOnce ? '' : 'Once'}() then add${!isOnce ? '' : 'Once'}() the same listener without removing the relationship first.`);
      }
    } else {
      const binding = new SignalBinding(this, listener, isOnce, context, priority);
      this._addBinding(binding);
    }

    if (this.memorize && this._prevParams) {
      this._bindings[index].execute(this._prevParams);
    }
  }

  _addBinding(binding) {
    let n = this._bindings.length;
    do {
      n--;
    } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
    this._bindings.splice(n + 1, 0, binding);
  }

  _indexOfListener(listener, context) {
    for (let i = this._bindings.length; i--; ) {
      const binding = this._bindings[i];
      if (binding._listener === listener && binding.context === context) {
        return i;
      }
    }
    return -1;
  }

  add(listener, context, priority) {
    this._registerListener(listener, false, context, priority);
  }

  addOnce(listener, context, priority) {
    this._registerListener(listener, true, context, priority);
  }

  remove(listener, context) {
    const index = this._indexOfListener(listener, context);
    if (index !== -1) {
      this._bindings[index]._destroy();
      this._bindings.splice(index, 1);
    }
  }

  dispatch(...args) {
    if (!this.active) return;

    const params = Array.prototype.slice.call(args);
    const bindings = this._bindings.slice();

    this._shouldPropagate = true;

    for (let i = bindings.length; i-- && this._shouldPropagate; ) {
      bindings[i].execute(params);
    }
  }

  removeAll() {
    for (let i = this._bindings.length; i--; ) {
      this._bindings[i]._destroy();
    }
    this._bindings.length = 0;
  }
}

export { Signal };
