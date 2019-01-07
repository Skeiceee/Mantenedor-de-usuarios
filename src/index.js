const http = require('http')
const path = require('path')
const express = require('express')

const app = express();
const server = http.createServer(path, app)

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'public', 'view'))
require('./routes')(path, app);

server.listen(3000, () => {
  console.log('Servidor en el puerto 3000')
})
