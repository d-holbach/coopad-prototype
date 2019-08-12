let socket;

const registerSocketEvents = (socket) => {
  socket.on('connect', () => {
    localStorage.setItem('userid', socket.id);
  });

  socket.on('reconnect', () => {
    localStorage.setItem('userid', socket.id);
  });

  socket.on('created', (data) => {
    localStorage.setItem('id', data.id);
  });
  
  socket.on('createdMediator', (data) => {
    localStorage.setItem('id', data.id);
  });

  socket.on('disconnect', () => {
    console.log(`Socket closed`);
    localStorage.removeItem('userid');
    localStorage.removeItem('id');
    localStorage.removeItem('mediator');
    localStorage.removeItem('mode');
    localStorage.removeItem('interval');
  });
}

const port = document.getElementById('port').value;
const url = window.location.origin.replace(/:\d{1,5}/, ':'+ port)
socket = io(url);
registerSocketEvents(socket);

export { socket };
