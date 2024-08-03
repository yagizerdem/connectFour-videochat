class Queue {
  constructor() {
    this.items = [];
  }

  // Add an item to the end of the queue
  enqueue(element) {
    this.items.push(element);
  }

  // Remove and return the item from the front of the queue
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.items.shift();
  }

  // Peek at the front item of the queue
  front() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.items[0];
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Get the size of the queue
  size() {
    return this.items.length;
  }

  // Print the queue
  print() {
    console.log(this.items.toString());
  }
}
module.exports = { Queue };
