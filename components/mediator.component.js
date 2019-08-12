'use strict';

const path = require('path');
const EventEmitter = require('events');
const shortid = require('shortid');
const config = require(path.join(__dirname, '../public/configs/gamepad.json'));
const Mediator = require(path.join(__dirname, '../models/mediator.model.js'));

class MediatorList {
  constructor() {
    this.mediators = {};
  }

  addMediator(user, mode, interval = null) {
    const id = shortid.generate();
    this.mediators[id] = new Mediator(id, mode, user, interval, null, config);
    return id;
  }

  initMediator(id, vid) {
    this.mediators[id].virtualGamepad = vid;
    this.mediators[id].init();
  }

  removeMediator(id) {
    this.mediators[id].destroy();
    delete this.mediators[id];
  }

  addUser(user, id) {
    this.mediators[id].addUser(user);
  }

  removeUser(id, user) {
    this.mediators[id].removeUser(user);
    if (this.mediators[id].getNumUser() === 0) {
      this.removeMediator(id);
    }
  }

  sendInput(user, id, input, value) {
    this.mediators[id].input(user, input, value);
  }
}

module.exports = new MediatorList(new EventEmitter());
