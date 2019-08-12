'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const mediatorList = document.querySelectorAll('ul li');
  let link, id;

  mediatorList.forEach((element) => {
    link = element.querySelector('a');
    id = element.querySelector('#mediatorID').value;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('id', id);
      localStorage.setItem('mediator', 1);
      window.location.href = '../gamepad';
    });
  });
});
