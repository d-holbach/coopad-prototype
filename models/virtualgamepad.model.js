'use strict';

const uinput = require('uinput');

module.exports = class VirtualGamepad {
  constructor(id, creator, config = null) {
    this.id = id;
    this.creator = creator;
    this.name = 'VirtualGamepad-' + id;
    this.stream = null;
    this.setupOptions = null;
    this.createOptions = null;
    this.config = config;
    this.init()
  }

  init() {
    this.createMapping();
    this.createSetupOptions();
    this.createCreateOptions();
    this.setup();
  }

  createMapping() {
    this.mapping = { axes: {}, buttons: {} };

    if ('left' in this.config.axes) {
      this.mapping.axes[this.config.axes.left.x.id] = uinput.ABS_X;
      this.mapping.axes[this.config.axes.left.y.id] = uinput.ABS_Y;
    }
    if ('right' in this.config.axes) {
      this.mapping.axes[this.config.axes.right.x.id] = uinput.ABS_RX;
      this.mapping.axes[this.config.axes.right.y.id] = uinput.ABS_RY;
    }
    if ('north' in this.config.buttons.action) this.mapping.buttons[this.config.buttons.action.north.id] = uinput.BTN_X;
    if ('south' in this.config.buttons.action) this.mapping.buttons[this.config.buttons.action.south.id] = uinput.BTN_A;
    if ('west' in this.config.buttons.action) this.mapping.buttons[this.config.buttons.action.west.id] = uinput.BTN_Y;
    if ('east' in this.config.buttons.action) this.mapping.buttons[this.config.buttons.action.east.id] = uinput.BTN_B;
    if ('start' in this.config.buttons.system) this.mapping.buttons[this.config.buttons.system.start.id] = uinput.BTN_START;
    if ('select' in this.config.buttons.system) this.mapping.buttons[this.config.buttons.system.select.id] = uinput.BTN_SELECT;
  }

  createSetupOptions() {
    this.setupOptions = {};
    this.setupOptions.EV_ABS = Object.values(this.mapping.axes);
    this.setupOptions.EV_KEY = Object.values(this.mapping.buttons);
  }

  createCreateOptions() {
    this.createOptions = { id: {} };
    this.createOptions.name = this.name;

    this.createOptions.id.bustype = uinput.BUS_VIRTUAL;
    this.createOptions.id.vendor = 0x1;
    this.createOptions.id.product = 0x1;
    this.createOptions.id.version = 1;

    const absmax = new Array(uinput.ABS_CNT).fill(0);
    const absmin = new Array(uinput.ABS_CNT).fill(0);
    const absfuzz = new Array(uinput.ABS_CNT).fill(0);
    const absflat = new Array(uinput.ABS_CNT).fill(0);

    Object.keys(this.config.axes).map((axe) => {
      let xCode = this.mapping.axes[this.config.axes[axe].x.id];
      let yCode = this.mapping.axes[this.config.axes[axe].y.id];

      absmax[xCode] = this.config.axes[axe].x.max;
      absmax[yCode] = this.config.axes[axe].y.max;
      absmin[xCode] = this.config.axes[axe].x.min;
      absmin[yCode] = this.config.axes[axe].y.min;
      absfuzz[xCode] = this.config.axes[axe].x.fuzz;
      absfuzz[yCode] = this.config.axes[axe].y.fuzz;
      absflat[xCode] = this.config.axes[axe].x.flat;
      absflat[yCode] = this.config.axes[axe].y.flat;
    });

    this.createOptions.absmax = absmax;
    this.createOptions.absmin = absmin;
    this.createOptions.absfuzz = absfuzz;
    // createOptions.absflat = absflat;
  }

  setup() {
    uinput.setup(this.setupOptions, (err, stream) => this.setupCallback(err, stream));
  }

  create() {
    uinput.create(this.stream, this.createOptions, (err) => this.errorCallback(err));
  }

  processInput(user, input, value) {
    if (user === this.creator) {
      let type = uinput.EV_KEY;
      let code;
      if (input in this.mapping.axes) {
        type = uinput.EV_ABS;
        code = this.mapping.axes[input];
      } else
        code = this.mapping.buttons[input];

      console.log(`Virtual Gamepad with ${this.id} sends ${input} as ${code} with ${type} and ${value}`);
      uinput.send_event(this.stream, type, code, value, (err) => this.errorCallback(err));

      this.stream._events.error = [];
    }
  }

  setupCallback(err, stream) {
    if (err) {
      throw(err);
    }

    this.stream = stream;
    this.create();
  }

  errorCallback(err) {
    if (err) {
      throw(err);
    }
  }

  destroy() {
    this.stream.destroy();
  }
}
