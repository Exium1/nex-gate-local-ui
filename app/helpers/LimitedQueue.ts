export class LimitedQueue<T> {

  queue: T[];
  private maxSize;

  constructor(maxSize: number) {
    this.queue = [];
    this.maxSize = maxSize;
  }

  enqueue(item: T) {
    this.queue.push(item);

    if (this.queue.length > this.maxSize) {
      this.queue.shift(); // The shift() method removes the first element
    }
  }

  dequeue() {
    return this.queue.shift();
  }

  get size() {
    return this.queue.length;
  }

  head() {
    return this.queue[0]
  }

  tail() {
    return this.queue[this.queue.length - 1]
  }

  clear() {
    this.queue = []
  }

  toString() {
    let output = `LimitedQueue(${this.queue.length}/${this.maxSize}):`;

    for (let i = 0; i < this.maxSize; i++) {
      output += ` [${this.queue[i] ? 'X' : ' '}]`
    }

    return output
  }
}

export class SortedLimitedQueue<T> {
  queue: T[];
  private maxSize: number;
  private compareFn: (a: T, b: T) => number;

  constructor(maxSize: number, compareFn: (a: T, b: T) => number) {
    this.queue = [];
    this.maxSize = maxSize;
    this.compareFn = compareFn;
  }

  enqueue(item: T) {
    this.queue.push(item);
    this.queue.sort(this.compareFn);
    if (this.queue.length > this.maxSize) {
      this.queue.pop(); // Drop the worst (last) entry
    }
  }

  get size() {
    return this.queue.length;
  }

  best() {
    return this.queue[0];
  }

  worst() {
    return this.queue[this.queue.length - 1];
  }

  clear() {
    this.queue = [];
  }

  toString() {
    let output = `SortedLimitedQueue(${this.queue.length}/${this.maxSize}):`;
    for (const item of this.queue) {
      output += ` [${item}]`;
    }
    return output;
  }
}