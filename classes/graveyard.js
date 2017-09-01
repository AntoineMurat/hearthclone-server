class Graveyard {
	constructor(player){
		this.player = player
		this.cards = []
	}

	add(card){
		let interrupted = this.player.game.eventEmitter.emit('willGoToGraveyard', {card: card, graveyard: this})
		if (interrupted)
			return
		this.cards.push(card)
		this.player.game.eventEmitter.emit('wentToGraveyard', {card: card, graveyard: this})
	}
}

module.exports = Graveyard