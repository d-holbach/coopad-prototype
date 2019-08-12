'use strict';

const postal = require('postal');

/**
 * Mode:  0 = Democracy
 *        1 = Anarchy
 *        2 = Interval
 *        3 = Random
 */

module.exports = class Mediator {
  constructor(id, mode, creator, interval = null, virtualGamepad, config) {
    this.id = id;
    this.mode = mode;
    this.creator = creator;
    this.interval = interval;
    this.virtualGamepad = virtualGamepad;
    this.config = config
    this.users = new Array();
    this.users.push(creator);
    this.timer = null;
    this.inputs = {};
  }

  init() {
    if (this.mode === 2 || this.mode === 3) {
      this.currentUser = this.users[0];
    }
    this.createMapping();
    this.start();
  }

  createMapping() {
    this.mapping = { axes: {} };

    if ('left' in this.config.axes) {
      this.mapping.axes[this.config.axes.left.x.id] = Math.round(this.config.axes.left.x.max / 2);
      this.mapping.axes[this.config.axes.left.y.id] = Math.round(this.config.axes.left.y.max / 2);
    }
    if ('right' in this.config.axes) {
      this.mapping.axes[this.config.axes.right.x.id] = Math.round(this.config.axes.right.x.max / 2);
      this.mapping.axes[this.config.axes.right.y.id] = Math.round(this.config.axes.right.x.max / 2);
    }
    this.mapping.buttons = 0;
  }

  start() {
    if (this.mode === 0) {
      this.timer = setInterval( () => this.democracy(), this.interval);
    } else if (this.mode === 2) {
      this.timer = setInterval( () => this.intervalF(), this.interval);
    } else if (this.mode === 3) {
      this.timer = setInterval( () => this.random(), this.interval);
    }
  }

  destroy() {
    clearInterval(this.timer);
  }

  isPressed(id, value) {
    if (id in this.mapping.axes && value !== this.mapping.axes[id])
      return true;
    else if ( !(id in this.mapping.axes) && value !== this.mapping.buttons)
      return true;
    else
      return false;
  }

  resetKey(id) {
    if (id in this.mapping.axes) {
      this.output(id, this.mapping.axes[id]);
    } else {
      this.output(id, this.mapping.buttons);
    }
  }

  addUser(user) {
    this.users.push(user);
  }

  removeUser(user) {
    let index = this.users.indexOf(user);
    this.users.splice(index, 1);

    if (this.users.length === 0) {
      this.stop();
    }
  }

  getNumUser() {
    return this.users.length
  }

  output(input, value) {
    console.log(`Mediator output to VGP: ${this.virtualGamepad} with input: ${input} and value ${value}`);
    postal.publish({
      channel: "vgp",
      topic: "input",
      data: {
          id: this.virtualGamepad,
          user: this.id,
          input: input,
          value: value
      }
    });
  }

  input(user, id, value) {
    if ( this.users.indexOf(user) !== -1 ) {
      if ( this.mode === 0 ) {
        if (this.isPressed(id, value)) {
          this.inputs[user] = {
            id: id,
            value: value
          };
        }
      } else if ( this.mode === 1 ) {
        this.output(id, value);
      } else if ( (this.mode === 2 || this.mode === 3) && this.currentUser === user)
        this.output(id, value);
        if (this.isPressed(id, value)) {
          this.inputs[user] = {
            id: id,
            value: value
          };
        }
    }
  }

  democracy() {
    if(this.inputs) {
      const input = mostCommonInput(this.inputs);
      if ( !isNaN(input.id) ) {
        this.output(input.id, input.value);
        setTimeout(() => {
          this.resetKey(input.id);
        }, 50);
      }
      this.inputs = {};
    }
  }

  intervalF() {
    let currentIndex = this.users.indexOf(this.currentUser);
    if (typeof this.inputs[this.currentUser] !== 'undefined') {
      this.resetKey(this.inputs[this.currentUser].id);
      this.inputs = {};
    }
    currentIndex++;
    if ( this.users.length === currentIndex ) {
      currentIndex = 0;
    }
    this.currentUser = this.users[currentIndex];
  }

  random() {
    let currentIndex = this.users.indexOf(this.currentUser);
    if (typeof this.inputs[this.currentUser] !== 'undefined') {
      this.resetKey(this.inputs[this.currentUser].id);
      this.inputs = {};
    }
    let newIndex = Math.floor(Math.random() * this.users.length)
    if ( currentIndex === newIndex ) {
      newIndex++;
      if ( this.users.length === newIndex ) {
        newIndex = 0;
      }
    }
    this.currentUser = this.users[newIndex];
  }
}

const mostCommonInput = (inputs) => {
  const count = {};
  let res = {};
  let maxCount = -1;

  res.id = NaN;
  res.value = NaN;

  Object.keys(inputs).map((input) => {
    let id = inputs[input].id;
    if (typeof count[id] === 'undefined') {
      count[id] = {};
    }
    count[id].quantity = ('quantity' in count[id]) ? count[id].quantity + 1 : 1
    count[id].value = ('value' in count[id]) ? count[id].value + inputs[input].value : inputs[input].value;
  });

  Object.keys(count).map((id) => {
    count[id].value = Math.round(count[id].value / count[id].quantity);
    if (count[id].quantity > maxCount) {
      res.id = id;
      res.value = count[id].value;
    }
  });

  return res;
}
