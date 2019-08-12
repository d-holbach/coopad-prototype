'use strict';

const path = require('path');
const shortid = require('shortid');
const VirtualGamepad = require(path.join(__dirname, '../models/virtualgamepad.model.js'));
const config = require(path.join(__dirname, '../public/configs/gamepad.json'));

class VirtualGamepadList {
    constructor() {
        this.gamepads = {};
    }

    addGamepad(creator) {
        const id = shortid.generate();
        this.gamepads[id] = new VirtualGamepad(id, creator, config);
        return id;
    }

    sendInput(user, id, input, value) {
        this.gamepads[id].processInput(user, input, value);
    }

    removeGamepad(user, id) {
        this.gamepads[id].destroy();
        delete this.gamepads[id];
        return user;
    }
}

module.exports = new VirtualGamepadList();
