'use strict';

const path = require('path');
const postal = require('postal');
const io = require(path.join(__dirname, '../components/io.component.js'));
const channel = postal.channel('client');


channel.subscribe("created", (data) => {
    if (data.creator in io.server.sockets.sockets) {
        io.send('created', data.creator, data)
    }
});

channel.subscribe("createdMediator", (data) => {
    if (data.creator in io.server.sockets.sockets) {
        io.send('createdMediator', data.creator, data)
    }
});

channel.subscribe("removed", (data) => {
    if (data.user in io.server.sockets.sockets) {
        io.send('removed', data)
    }
});
