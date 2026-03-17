class EventEmitter {
  constructor() {
    this.events = {};
  }

  // Method to subscribe to an event
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // Method to emit an event
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => {
        listener(...args);
      });
    }
  }

  // Method to unsubscribe from an event
  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(
        existingListener => existingListener !== listener
      );
    }
  }
}
