'use strict';

const path = require('path');
const postal = require('postal');
const channel = postal.channel('vgp');
const vList = require(path.join(__dirname, '../components/virtualgamepad.component.js'));

channel.subscribe("create", (data) => {
    const id = vList.addGamepad(data.user);

    const created = {
        id: id,
        creator: data.user
    }
    postal.publish({
        channel: "mediator",
        topic: "created",
        data: created
    });
    postal.publish({
        channel: "client",
        topic: "created",
        data: created
    });
});

channel.subscribe("remove", (data) => {
    vList.removeGamepad(data.user, data.id);
    const removed = {
        id: data.id,
        creator: data.user
    }
    postal.publish({
        channel: "mediator",
        topic: "removed",
        data: removed
    });
    postal.publish({
        channel: "client",
        topic: "removed",
        data: removed
    });
});

channel.subscribe("input", (data) => {
    vList.sendInput(data.user, data.id, data.input, data.value);
});

