const EventEmitter = require('events')
const Player = require('./player')

class Game {

	constructor(client1, client2){

		this.eventEmitter = new EventEmitter()

		this.client1 = client1
		this.client2 = client2

		this.player1 = new Player(client1)
		this.player2 = new Player(client2)
	}

	won(winner){
		this.eventEmitter.emit('won', winner)
		clearTimeout(winner.automaticEndOfTurn)
		clearTimeout(this.opponentOf(winner).automaticEndOfTurn)
		// We should remove all listeners in order to let the GC do his job.
	}

	opponentOf(player){
		player == player1 ? player2 : player1
	}

}

module.exports = Game