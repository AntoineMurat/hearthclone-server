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
		// Add listener.
		const eventsToListenTo = ['none']
		
		const onEvent = data => {

			if (!this.secret.secretConditions(data))
				return
		
			const effect = secret.effect
			this.player.act(effect, data)
			this.player.graveyard.add(secret)

			for event of eventsToListenTo
				this.player.game.eventEmitter.removeListener(event, onEvent)

		}

		for event of eventsToListenTo
			this.player.game.eventEmitter.on(event, onEvent)

	}
}

module.exports = Secrets