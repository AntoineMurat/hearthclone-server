const Client = require('Client')

class Server{

	constructor(maxNbrCLients = 100){
		this.maxNbrCLients = maxNbrCLients
		this.inGameClients = []
		this.inMatchMakingCLients = []
		this.games = []

		this.matchmaking = setInterval(_ => {

			if (this.inMatchMakingCLients.length > 1){
				const client1 = this.inMatchMakingCLients.pop()
				const client2 = this.inMatchMakingCLients.pop()

				const game = new Game(client1, client2)

				this.games.push(game)

				game.eventEmitter.on('won', data => {

					this.games.slpice(this.games.indexOf(game), 1)

					this.inGameClients.slpice(this.inGameClients.indexOf(client1), 1)
					this.inGameClients.slpice(this.inGameClients.indexOf(client2), 1)

					if (client1.socket.connected)
						this.inMatchMakingCLients.push(client1)
					if (client2.socket.connected)
						this.inMatchMakingCLients.push(client2)

				})

			}

		}, 500)
	}

	newClient(socket){
		if (this.inGameClients.length + this.inMatchMakingCLients.length < this.maxNbrCLients){

			this.inMatchMakingCLients.push(new Client(socket))

			client.socket.on('disconnect', _ => {

				// If he was in matchmaking :

				if (this.inMatchMakingCLients.includes(client))
					return this.inMatchMakingCLients.slpice(this.inMatchMakingCLients.indexOf(client), 1)

				// Then he is in-game.
				// We just have to find the game and make his opponent win to end the process normally.
			
				for (let game of this.games){
					if (game.client1 == client){
						game.won(client2)
						break
					}
					if (game.client2 == client){
						game.won(client1)
					}
				}

			})


		} else {

			socket.emit('error', {message: 'Server full.'})

		}
	}

}

module.exports = Server