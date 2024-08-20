import { computed } from 'vue';

export function useVModel(props, key, emit) {
  return computed({
    get: () => props[key],
    set: (value) => emit(`update:${key}`, value),
  });
}
