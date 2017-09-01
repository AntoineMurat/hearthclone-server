const EventEmitter = require('./eventEmitter')
const Player = require('./player')

const Cards = require('./../enums/cards')

class Game {

	constructor(client1, client2){

		this.id = Array(10).fill().map(_ => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random()*62)]).join('')

		this.eventEmitter = new EventEmitter(this)
		this.setupLogging()
		this.startLogging()

		this.client1 = client1
		this.client2 = client2

		this.player1 = new Player(this, client1)
		this.player2 = new Player(this, client2)

		this.eventEmitter.emit('preparing')

		this.player1Listener = (data = {}, fn) => {
			try {
				this.player1.play(data)
				if (typeof fn === 'function')
					fn({success: true})
			} catch (error) { 
				console.error(`Error during execution of "${data.action}": ${error.stack/*.message*/}`)
				if (typeof fn === 'function')
					fn({success: false, error: error.message})
			}}

		this.player2Listener = (data = {}, fn) => {
			try {
				this.player2.play(data)
				if (typeof fn === 'function')
					fn({success: true})
			} catch (error) { 
				console.error(`Error during execution of "${data.action}": ${error.stack/*.message*/}`)
				if (typeof fn === 'function')
					fn({success: false, error: error.message})
			}}

		this.player1.client.socket.on('play', this.player1Listener)
		this.player2.client.socket.on('play', this.player2Listener)

		this.player2.hand.takeCard(Cards.copy(Cards.COIN))

		this.eventEmitter.emit('started')

		this.player1.newTurn()
	}

	won(winner){
		this.eventEmitter.emit('won', {winner: winner})
		clearTimeout(winner.automaticEndOfTurn)
		clearTimeout(this.opponentOf(winner).automaticEndOfTurn)
		this.player1.client.socket.removeListener('play', this.player1Listener)
		this.player2.client.socket.removeListener('play', this.player2Listener)

		setTimeout(_ => this.endLogging(), 1000)
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
			callback: data => this.log(`${data.winner.id} won over ${this.opponentOf(data.winner).id}.`)
		})

		this.loggers.push({
			event: 'played',
			callback: data => this.log(`${data.player.id} played ${data.card.cardName}.`)
		})

		this.loggers.push({
			event: 'willAttack',
			callback: data => this.log(`${data.attacker.id} will attack ${data.target.id}.`)
		})

		this.loggers.push({
			event: 'attacked',
			callback: data => this.log(`${data.attacker.id} attacked ${data.target.id}.`)
		})

		this.loggers.push({
			event: 'willBeHealed',
			callback: data => this.log(`${data.target.id} will be healed.`)
		})

		this.loggers.push({
			event: 'willBeSilenced',
			callback: data => this.log(`${data.minion.id} will be silenced.`)
		})

		this.loggers.push({
			event: 'endOfTurn',
			callback: data => this.log(`${data.player.id} ended his turn.`)
		})

		this.loggers.push({
			event: 'newTurn',
			callback: data => this.log(`${data.player.id} started his turn.`)
		})

		this.loggers.push({
			event: 'wasDealtDamages',
			callback: data => this.log(`${data.target.id} was dealt ${data.damages} damages.`)
		})

		this.loggers.push({
			event: 'wasHealed',
			callback: data => this.log(`${data.target.id} restored ${data.hp} health.`)
		})

		this.loggers.push({
			event: 'wasDestroyed',
			callback: data => this.log(`${data.minion.id} was destroyed.`)
		})

		this.loggers.push({
			event: 'wasSilenced',
			callback: data => this.log(`${data.minion.id} was silenced.`)
		})

		this.loggers.push({
			event: 'drew',
			callback: data => this.log(`${data.player.id} drew ${data.card.cardName}.`)
		})

		this.loggers.push({
			event: 'plays',
			callback: data => this.log(`${data.player.id} plays ${data.card.cardName}.`)
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

	status(){
		return `/////////////////////////\n`+
		`//// GAME ${this.id} ////\n`+
		`// ${this.player1.id} VS ${this.player2.id} //\n`+
		`////////////////// PLAYER 1 ///////////////////\n`+
		this.player1.status()+'\n'+
		`////////////////// PLAYER 2 //////////////////\n`+
		this.player2.status()+'\n'+
		'//////////////////////////////////////////////\n'
	}

}

module.exports = Game