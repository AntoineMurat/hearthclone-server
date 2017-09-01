class Secrets {
	constructor(player){
		this.player = player
		this.secrets = []
	}


	canBePlayed(secret){
		return !this.secrets.some(e => e.id == secret.id) 
	}

	add(secret){
		this.secrets.push(secret)

		secret.interruptor.card = secret
		this.player.game.eventEmitter.addInterruptor(secret.interruptor)
	}

	remove(card){
		this.secret.splice(this.secrets.indexOf(card), 1)
	}

	status(){
		return this.secrets.map(secret => secret.cardName).join('\n')
	}
}

module.exports = Secrets