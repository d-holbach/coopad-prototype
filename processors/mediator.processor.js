'use strict';

const path = require('path');
const postal = require('postal');
const channel = postal.channel('mediator');
const mList = require(path.join(__dirname, '../components/mediator.component.js'));

channel.subscribe("createMediator", (data) => {
    const id = mList.addMediator(data.user, data.mode, data.interval);

    postal.publish({
        channel: "vgp",
        topic: "create",
        data: {
            user: id
        }
    });
});

channel.subscribe("created", (data) => {
    if (data.creator in mList.mediators) {
        mList.initMediator(data.creator, data.id);
        postal.publish({
            channel: "client",
            topic: "createdMediator",
            data: {
                id: data.creator,
                creator: mList.mediators[data.creator].creator
            }
        });
    }
});

channel.subscribe("inputMediator", (data) => {
    mList.sendInput(data.user, data.id, data.input, data.value);
});

channel.subscribe("join", (data) => {
    const joined = mList.addUser(data.user, data.id);
    if (joined) {
        postal.publish({
            channel: "client",
            topic: "joined",
            data: {
                user: data.user,
                id: data.id
            }
        });
    }
});

channel.subscribe("removeMediator", (data) => {
    postal.publish({
        channel: "vgp",
        topic: "remove",
        data: {
            id: data.virtualGamepad,
            user: data.id
        }
    });
});

channel.subscribe("removed", (data) => {
    mList.removeMediator(data.creator);
    postal.publish({
        channel: "vgp",
        topic: "remove",
        data: {
            id: data.creator
        }
    });
});
