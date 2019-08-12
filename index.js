'use strict'

const path = require('path');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '/.env') });

if (dotenv.error) {
  throw dotenv.error
}

process.env.PORT = process.env.PORT || 3000;
process.env.WSPORT = process.env.WSPORT || 3001;

const express = require('express');
const mList = require(path.join(__dirname, 'components/mediator.component.js'));
const app = express();
const http = require('http').createServer(app);

require(path.join(__dirname, 'processors/client.processor.js'));
require(path.join(__dirname, 'processors/virtualgamepad.processor.js'));
require(path.join(__dirname, 'processors/mediator.processor.js'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/public/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/public/vendor/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/public/vendor/bs-stepper', express.static(path.join(__dirname, 'node_modules/bs-stepper/dist')));
app.use('/public/vendor/io', express.static(path.join(__dirname, 'node_modules/socket.io-client/dist/')));
app.use('/public', express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.render('index', { title: 'Coopad', bodyClass: 'start' });
});

app.get('/gamepad', (req, res) => {
  res.render('gamepad', { title: 'Gamepad', bodyClass: "gamepad", port: process.env.WSPORT });
});

app.get('/mediators', (req, res) => {
  res.render('mediator', { title: 'Active Mediator', bodyClass: "mediator", mediators: mList.mediators });
});

app.get('/createMediator', (req, res) => {
  res.render('createmediator', { title: 'Config Mediator', bodyClass: "mediator" });
});

app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Not found', bodyClass: 'error' });
});

http.listen(process.env.PORT, () => console.log(`Server runs on port: ${process.env.PORT}`));

