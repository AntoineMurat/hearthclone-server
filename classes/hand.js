const CardTypes = require('./../enums/cardTypes')

class Hand{
	constructor(player){
		this.player = player
		this.cards = []
	}

	drawCard(){
		const drawnCard = this.player.library.pop()
		if (drawnCard === false)
			return
		if (this.cards.length == 10)
			return this.player.graveyard.add(drawnCard)
		this.cards.push(drawnCard)
	}

	drawCards(n){
		for (let i = n; i>0; i--)
			this.drawCard()
	}

	playCardByIndex(index, data = {}){
		if (typeof this.cards[index] === 'undefined')
			throw new Error('Card not in hand.')
		const cardToPlay = this.cards[index]
		this.cards.splice(index, 1)

		this.player.playCard(cardToPlay, data)
	}
}

module.exports = Hand