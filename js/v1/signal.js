// Signal
let subscriber = null;

function signal(initialValue) {
  let value = initialValue;
  const subscriptions = new Set();
  const watchers = new Set();

  return {
    get value() {
      if (subscriber) {
        subscriptions.add(subscriber);
      }
      return value;
    },

    set value(updated) {
      if (value !== updated) {
        const oldValue = value;
        value = updated;
        subscriptions.forEach((callback) => callback());
        watchers.forEach((callback) => callback(oldValue, updated));
      }
    },

    addWatcher(callback) {
      watchers.add(callback);
      return () => watchers.delete(callback);
    },
  };
}

function effect(callback) {
  subscriber = callback;
  callback();
  subscriber = null;
}

function compute(callback) {
  const newSig = signal();
  effect(() => {
    newSig.value = callback();
  });

  return newSig;
}

function watch(signal, callback) {
  const handler = (oldValue, newValue) => {
    callback(oldValue, newValue);
  };
  const unsubscribe = signal.addWatcher(handler);
  return unsubscribe;
}
