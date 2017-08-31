class Graveyard {
	constructor(player){
		this.player = player
		this.cards = []
	}

	add(card){
		this.cards.push(card)
	}
}

module.exports = Graveyard