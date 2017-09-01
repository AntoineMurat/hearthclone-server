const Client = require('./client')
const Game = require('./game')

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

					this.games.splice(this.games.indexOf(game), 1)

					this.inGameClients.splice(this.inGameClients.indexOf(client1), 1)
					this.inGameClients.splice(this.inGameClients.indexOf(client2), 1)

					if (client1.socket.connected)
						this.inMatchMakingCLients.push(client1)
					if (client2.socket.connected)
						this.inMatchMakingCLients.push(client2)

				})

			}
			if (this.inMatchMakingCLients.length)
				console.log(`${this.inMatchMakingCLients.length} clients waiting in matchmaking.`)

		}, 500)
	}

	newClient(socket){
		if (this.inGameClients.length + this.inMatchMakingCLients.length < this.maxNbrCLients){

			const client = new Client(socket)

			console.log(`New client: ${socket.id}`)

			this.inMatchMakingCLients.push(client)

			client.socket.on('disconnect', _ => {

				// If he was in matchmaking :

				if (this.inMatchMakingCLients.includes(client))
					return this.inMatchMakingCLients.splice(this.inMatchMakingCLients.indexOf(client), 1)

				// Then he is in-game.
				// We just have to find the game and make his opponent win to end the process normally.
			
				for (let game of this.games){

					if (game.client1 == client){
						game.won(game.player2)
						break
					}
					if (game.client2 == client){
						game.won(game.player1)
						break
					}
				}

			})

			client.socket.on('watch', data => {

				let game

				if (!data || !data.game)
					game = this.games.find(g => g.client1 === client || g.client2 === client)
				else
					game = this.games.find(g => g.id === data.game)

				if (game)
					console.log(game.status())
				else 
					console.log(`Couldn\'t find game ${data.game}`)
			})

		} else {

			socket.emit('error', {message: 'Server full.'})

		}
	}

}

module.exports = Server