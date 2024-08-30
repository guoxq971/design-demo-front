import { createEventHook } from '@vueuse/core';

export function fnCreateEventHook() {
  const event = createEventHook();

  const fns = new Set();

  function on(fn) {
    fns.add(fn);
    event.on(fn);

    return function off() {
      fns.delete(fn);
      event.off(fn);
    };
  }

  function off(fn) {
    fns.delete(fn);
    event.off(fn);
  }

  function offAll() {
    fns.forEach((fn) => {
      event.off(fn);
    });
    fns.clear();
  }

  return {
    on: on,
    off: off,
    trigger: event.trigger,
    offAll,
  };
}
