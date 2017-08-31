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
}

module.exports = Library