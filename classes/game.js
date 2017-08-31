const EventEmitter = require('events')
const Player = require('./player')

class Game {

	constructor(client1, client2){

		this.eventEmitter = new EventEmitter()

		this.client1 = client1
		this.client2 = client2

		this.player1 = new Player(this, client1)
		this.player2 = new Player(this, client2)

		this.id = Array(10).fill().map(_ => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random()*62)]).join('')

		this.setupLogging()
		this.startLogging()

		this.eventEmitter.emit('start')

		this.player1.client.socket.on('play', data => this.player1.play(data))
		this.player2.client.socket.on('play', data => this.player2.play(data))

		this.player1.newTurn()
	}

	won(winner){
		this.eventEmitter.emit('won', {winner: winner})
		clearTimeout(winner.automaticEndOfTurn)
		clearTimeout(this.opponentOf(winner).automaticEndOfTurn)
		this.player1.client.socket.removeListener('play', data => this.player1.play(data))
		this.player2.client.socket.removeListener('play', data => this.player2.play(data))

		this.endLogging()
	}

	log(message){
		console.log(`[${this.id}] ${message}`)
	}

	setupLogging(){
		this.loggers = []
		// [{event: 'event', callback: callback}, ...]

		this.loggers.push({
			event: 'start',
			callback: data => this.log(`${this.client1.socket.id} vs ${this.client2.socket.id}.`)
		})

		this.loggers.push({
			event: 'won',
			callback: data => this.log(`${data.winner.client.socket.id} won over ${this.opponentOf(data.winner).client.socket.id}.`)
		})

		this.loggers.push({
			event: 'played',
			callback: data => this.log(`${data.player.client.socket.id} played ${data.card.cardName}.`)
		})

		this.loggers.push({
			event: 'attack',
			callback: data => this.log(`${data.attacker} attack ${data.target}.`)
		})

		this.loggers.push({
			event: 'attacked',
			callback: data => this.log(`${data.attacker} attacked ${data.target}.`)
		})

		this.loggers.push({
			event: 'heal',
			callback: data => this.log(`${data.healer} heal ${data.target}.`)
		})

		this.loggers.push({
			event: 'healed',
			callback: data => this.log(`${data.healer} healed ${data.target}.`)
		})

		this.loggers.push({
			event: 'endOfTurn',
			callback: data => this.log(`${data.player} ended his turn.`)
		})

		this.loggers.push({
			event: 'newTurn',
			callback: data => this.log(`${data.player} started his turn.`)
		})

		this.loggers.push({
			event: 'wasDealtDamages',
			callback: data => this.log(`${data.target} was dealt ${data.damages} damages.`)
		})

		this.loggers.push({
			event: 'wasHealed',
			callback: data => this.log(`${data.target} restored {data.hp} health.`)
		})

	}

	startLogging(){
		for (const logger of this.loggers)
			this.eventEmitter.on(logger.event, logger.callback)
	}

	endLogging(){
		for (const logger of this.loggers)
			this.eventEmitter.removeListener(logger.event, logger.callback)
	}


	opponentOf(player){
		return player === this.player1 ? this.player2 : this.player1
	}

}

module.exports = Game