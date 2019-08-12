'use strict';

const Server = require('socket.io');
const postal = require('postal');

class IOHandler {
    constructor() {
        this.server = new Server(process.env.WSPORT);
        this.registerEvents();
    }

    registerEvents() {
        this.server.on('connection', (socket) => {
            socket.on('create', (user) => {
                postal.publish({
                    channel: "vgp",
                    topic: "create",
                    data: {
                        user: user
                    }
                });
            });

            socket.on('createMediator', (user, mode, interval) => {
                postal.publish({
                    channel: "mediator",
                    topic: "createMediator",
                    data: {
                        user: user,
                        mode: mode,
                        interval: interval
                    }
                });
            });

            socket.on('input', (user, id, input, value) => {
                postal.publish({
                    channel: "vgp",
                    topic: "input",
                    data: {
                        user: user,
                        id: id,
                        input: input,
                        value: value
                    }
                });
            });

            socket.on('inputMediator', (user, id, input, value) => {
                postal.publish({
                    channel: "mediator",
                    topic: "inputMediator",
                    data: {
                        user: user,
                        id: id,
                        input: input,
                        value: value
                    }
                });
            });

            socket.on('join', (user, id,) => {
                postal.publish({
                    channel: "mediator",
                    topic: "join",
                    data: {
                        user: user,
                        id: id
                    }
                });
            });

            socket.on('remove', (user, id) => {
                postal.publish({
                    channel: "vgp",
                    topic: "remove",
                    data: {
                        user: user,
                        id: id
                    }
                });
            });

            console.log('a user connected id:', socket.id);
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }

    send(topic, user, data) {
        this.server.sockets.sockets[user].emit(topic, data);
    }
}

module.exports = new IOHandler();
