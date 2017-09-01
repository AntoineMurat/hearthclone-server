const Minion = require('./minion')

class Battlefield{
	constructor(player){
		this.player = player
		this.minions = []
	}

	newMinion(player, minion, data){
		if (this.minions.length > 6)
			throw new Error('Battlefield already full.')

		const newMinion = new Minion(player, minion)

		let interrupted = this.player.game.eventEmitter.emit('willPutNewMinion', {minion: minion, player: this.player})
		if (interrupted)
			return

		// Inserting at the right position
		let position
		if (typeof data.position === 'undefined' || ![0,1,2,3,4,5,6].includes(data.position) || data.position > this.minions.length)
			position = this.minions.length
		else
			position = data.position
		this.minions.splice(position, 0, newMinion)

		if (minion.interruptor){
			minion.interruptor.card = minion
			this.player.game.eventEmitter.addInterruptor(minion.interruptor)
		}

		data.minion = newMinion
		if (minion.battlecry)
			minion.battlecry(data)

		this.player.game.eventEmitter.emit('putNewMinion', {minion: minion, player: this.player})
	}

	removeMinion(minion){
		this.minions.splice(this.minions.indexOf(minion), 1)
	}

	destroyAllMinions(){
		this.minions.forEach(minion => minion.destory())
	}

	get spellPower(){
		this.minions.reduce(
			(sum, minion) => sum + (minion.card.spellPower ? minion.card.spellPower : 0), 0)
	}

	getMinionByIndex(n){
		if (typeof this.minions[n] === 'undefined')
			throw new Error('Index out of range.')
		return this.minions[n]
	}

	status(){
		return this.minions.map(minion => minion.status()).join('\n////////////\n')
	}
}

module.exports = Battlefield