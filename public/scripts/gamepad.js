import { socket } from './modules/socket.module.js';
let config;

const socketInput = (input, value) => {
  const user = localStorage.getItem('userid');
  const id = localStorage.getItem('id');
  const mediator = parseInt(localStorage.getItem('mediator'));

  if (user !== null) {
    if (mediator === 1) {
      socket.emit('inputMediator', user, id, input, value);
    } else {
      socket.emit('input', user, id, input, value);
    }
  }
};

const bindElements = () => {
  const gamepadContainer = document.querySelector('.gamepad-container');
  const movement = gamepadContainer.querySelector('.movement');
  const system = gamepadContainer.querySelector('.system');
  const action = gamepadContainer.querySelector('.action');

  config.axes.left.x.element = [ movement.querySelector('.east a'), movement.querySelector('.west a') ];
  config.axes.left.x.value = 0;
  config.axes.left.y.element =  [ movement.querySelector('.south a'), movement.querySelector('.north a') ];
  config.axes.left.y.value = 0;
  config.buttons.action.north.element =  action.querySelector('.north a');
  config.buttons.action.north.value = 0;
  config.buttons.action.south.element =  action.querySelector('.south a');
  config.buttons.action.south.value = 0;
  config.buttons.action.west.element =  action.querySelector('.west a');
  config.buttons.action.west.value = 0;
  config.buttons.action.east.element =  action.querySelector('.east a');
  config.buttons.action.east.value = 0;
  config.buttons.system.start.element =  system.querySelector('a.right');
  config.buttons.system.start.value = 0;
  config.buttons.system.select.element =  system.querySelector('a.left');
  config.buttons.system.select.value = 0;
}

const registerEventListener = () => {
  Object.keys(config.axes).map((stick) => {
    Object.keys(config.axes[stick]).map((axe) => {
      config.axes[stick][axe].element[0].addEventListener('touchstart', () => {
        config.axes[stick][axe].value = config.axes[stick][axe].max;
        socketInput(config.axes[stick][axe].id, config.axes[stick][axe].value);
      });
      config.axes[stick][axe].element[0].addEventListener('touchend', () => {
        config.axes[stick][axe].value =  Math.round(config.axes[stick][axe].max / 2);
        socketInput(config.axes[stick][axe].id, config.axes[stick][axe].value);
      });
      config.axes[stick][axe].element[1].addEventListener('touchstart', () => {
        config.axes[stick][axe].value = config.axes[stick][axe].min;
        socketInput(config.axes[stick][axe].id, config.axes[stick][axe].value);
      });
      config.axes[stick][axe].element[1].addEventListener('touchend', () => {
        config.axes[stick][axe].value =  Math.round(config.axes[stick][axe].max / 2);
        socketInput(config.axes[stick][axe].id, config.axes[stick][axe].value);
      });
    });
  });

  Object.keys(config.buttons).map((section) => {
    Object.keys(config.buttons[section]).map((button) => {
      config.buttons[section][button].element.addEventListener('touchstart', () => {
        config.buttons[section][button].value = 1;
        socketInput(config.buttons[section][button].id, config.buttons[section][button].value);
      });

      config.buttons[section][button].element.addEventListener('touchend', () => {
        config.buttons[section][button].value = 0;
        socketInput(config.buttons[section][button].id, config.buttons[section][button].value);
      });
    });
  });
}

const init = () => {
  const user = localStorage.getItem('userid');
  const id = localStorage.getItem('id');
  const mediator = parseInt(localStorage.getItem('mediator'));
  const mode = parseInt(localStorage.getItem('mode'));
  const interval = parseInt(localStorage.getItem('interval'));

  if (id !== null && mediator === 1) {
    socket.emit('join', user, id);
  } else if (id === null && mediator === 1) {
    if (mode !== 1) {
      socket.emit('createMediator', user, mode, interval);
    } else {
      socket.emit('createMediator', user, mode);
    }
  } else {
    socket.emit('create', user);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetch(window.location.origin + '/public/configs/gamepad.json')
  .then( (response) => {
    return response.json();
  })
  .then( (mapping) => {
    config = mapping;
    setTimeout(() => {
      init();
    }, 1000)
    bindElements();
    registerEventListener();
  });
});
