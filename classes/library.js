class Library {
	constructor(player, deck){
		this.cards = deck
	}


	pop(){
		return this.cards.pop()
	}
}

module.exports = Library