'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const stepper = new Stepper(document.querySelector('.bs-stepper'));
  const listGroup = document.querySelector('.bs-stepper .list-group');
  const listGroupButtons = listGroup.querySelectorAll('button');
  const form = document.querySelector('.bs-stepper .bs-stepper-content form');
  const modeInput = form.querySelector('input[name="mode"]');
  const intervalInput = form.querySelector('input[name="interval"]');
  const recapMode = form.querySelector('.recap #r-mode');
  const recapInterval = form.querySelector('.recap #r-interval');

  form.querySelector('#next1').addEventListener('click', (e) => {
    e.preventDefault();
    stepper.next();
  });

  form.querySelector('#next2').addEventListener('click', (e) => {
    e.preventDefault();
    stepper.next();
  });

  form.querySelector('#submit').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('mode', modeInput.getAttribute('value'));
    localStorage.setItem('interval', intervalInput.getAttribute('value'));
    localStorage.setItem('mediator', 1);
    window.location.href = '../gamepad';
  });

  for (let i = 0; i < listGroupButtons.length; i++) {
    listGroupButtons[i].addEventListener('click', (e) => {
      let activeElement = listGroup.querySelector(".active");
      let mode = e.target.getAttribute('data-mode');
      activeElement.classList.remove('active');
      e.target.classList.add('active');
      modeInput.setAttribute('value', mode);
      recapMode.innerHTML = 'Mode: ' + mode;
    });
  }

  intervalInput.addEventListener('input', (e) => {
    form.querySelector('#intervalValue').innerHTML = e.target.value + 'ms';
    recapInterval.innerHTML = 'Interval: ' + e.target.value + 'ms'
  });
});
