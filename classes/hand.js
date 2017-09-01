const CardTypes = require('./../enums/cardTypes')

class Hand{
	constructor(player){
		this.player = player
		this.cards = []
	}

	takeCard(card){
		if (this.cards.length == 10)
			return this.player.graveyard.add(card)
		this.cards.push(card)
	}

	drawCard(){
		this.player.game.eventEmitter.emit('willDraw', {player: this.player})
		const drawnCard = this.player.library.pop()
		if (drawnCard === false)
			return
		this.player.game.eventEmitter.emit('drew', {player: this.player, card: drawnCard})
		this.takeCard(drawnCard)
	}

	drawCards(n){
		for (let i = 0; i<n; i++)
			this.drawCard()
	}

	playCardByIndex(index, data = {}){
		if (typeof this.cards[index] === 'undefined')
			throw new Error('Card not in hand.')
		const cardToPlay = this.cards[index]

		this.player.playCard(cardToPlay, data)
		this.remove(cardToPlay)
	}

	remove(card){
		this.cards.splice(this.cards.indexOf(card), 1)
	}

	status(){
		return this.cards.map(card => card.cardName).join('\n')
	}
}

module.exports = Hand