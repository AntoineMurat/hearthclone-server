const EventEmitter = require('events')
const util = require('util')
const CardTypes = require('./../enums/cardTypes')

class CustomEmitter extends EventEmitter{

	constructor(game){
		super()

		this.game = game
		this.interruptors = new Set()
	}

	emit(event, data){
		super.emit(event, data)

		this.game.log(`[${event}] ${util.inspect(data, false, 0)}`)

		let interrupted = false

		// Check all interruptors for events...
		let whateverItWillBe = [... this.interruptors].forEach(interruptor => {
			if (event === interruptor.event && interruptor.condition(data)){

				// If trap :
				if (interruptor.card.cardType === CardTypes.SPELL){

					// Only during opponent turn.
					if (interruptor.card.player.isHisTurn)
						return

					interruptor.effect(data)

					interruptor.player.secrets.remove(interruptor.card)
					this.interruptors.delete(interruptor)

					if (interruptor.interrupts)
						interrupted = true

				} else {

					interruptor.effect(data)

					if (interruptor.interrupts)
						interrupted = true

				}

			}
		})

		return interrupted
	}

	addInterruptor(interruptor){

		this.interruptors.add(interruptor)

	}

	removeInterruptorByCard(card){
		this.interruptors.delete([...this.interruptors].find(i => i.card === card))
	}
}

module.exports = CustomEmitter