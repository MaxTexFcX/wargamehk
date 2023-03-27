const asyncHandler = require('express-async-handler');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let _COM;

const GetPath = asyncHandler(async (req, res) => {
  const port = await SerialPort.list();
  res.json(port.map((port) => port.path));
});

const SetPath = asyncHandler(async (req, res) => {
  const portPath = req.params.port;
  _COM = new SerialPort({
    path: portPath,
    baudRate: 9600,
  });

  _COM.on('open', () => {
    console.log(`Connected to ${portPath}`);
    res.json({ message: `Connected to ${portPath}` });
  });

  _COM.on('error', (err) => {
    console.error('Error:', err.message);
    res.status(500).json({ message: err.message });
  });

});

const On = asyncHandler(async (req, res) => {
  setTimeout(function () {
    _COM.write('A');
    return res.json({ message: 'Done' });
  }, 0);
});

const Off = asyncHandler(async (req, res) => {
  setTimeout(function () {
    _COM.write('a');
    return res.json({ message: 'Done' });
  }, 0);
});

module.exports = {
  get COM() {
    return _COM;
  },
  set COM(value) {
    _COM = value;
    updateCOM(value);
  },
  On,
  Off,
  GetPath,
  SetPath,
};

function updateCOM(com) {
  console.log('COM updated:', com);
  if (com) {
    const parser = com.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    parser.on('data', function (data) {
      console.log(data);
      io.emit('data', data);
    });
  }
}