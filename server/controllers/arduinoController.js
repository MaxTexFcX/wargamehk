const asyncHandler = require('express-async-handler')
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { SerialPort } = require('serialport')

const port = new SerialPort({
  path: 'COM4',
  baudRate: 9600,
})

const On = asyncHandler(async (req, res) => {

  setTimeout(function () {
    port.write("A")
    return res.json({ message: "Done" })
  }, 0)

})

const Off = asyncHandler(async (req, res) => {

  setTimeout(function () {
    port.write("a")
    return res.json({ message: "Done" })
  }, 0)

})

module.exports = {
  On,
  Off,
  port: port
}