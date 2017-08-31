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

		const onEvent = data => {

			if (!this.secret.secretConditions(data))
				return
		
			const effect = secret.effect
			this.player.act(effect, data)
			this.player.graveyard.add(secret)

			this.player.game.eventEmitter.removeListener(secret.secretEvent, onEvent)

		}

		this.player.game.eventEmitter.on(secret.secretEvent, onEvent)

	}

	status(){
		return this.secrets.map(secret => secret.cardName).join('\n')
	}
}

module.exports = Secrets