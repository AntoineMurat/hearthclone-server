const io = require('socket.io')()
const server = new require('./classes/server')()

io.on('connection', socket => {
	server.newClient(socket)
})

io.listen(3000)