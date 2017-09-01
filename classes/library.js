class Library {
	constructor(player, deck){
		this.player = player
		this.cards = deck

		this.dealtDamages = 0
	}

	pop(){
		if (this.cards.length > 0)
			return this.cards.pop()
		
		this.player.dealDamages(++this.dealtDamages)
		return false
	}

	insertRandomly(card){
		this.cards.push(card)
		this.shuffle()
	}

	shuffle(){
		this.cards = this.cards.sort(_ => Math.random()-0.5)
	}
}

module.exports = Library