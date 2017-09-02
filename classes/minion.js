const Cards = require('./../enums/cards')

class Minion {

	constructor(player, card){
		this.player = player
		this.card = card
		this.enchantments = []
		this.canAttack = 0
		if (this.card.charge)
			this.reset()
		this.card.totalHealth = this.card.health
		this.card.frozen = false
	}

	reset(){
		this.canAttack = this.card.windfury ? 2 : 1
		this.attacked = false
	}

	give(attack, health){
		this.card.setAttack(this.card.attack + attack)
		this.card.setHealth(this.card.health + health)
	}

	setAttack(attack){
		this.card.attack = attack
	}

	setHealth(health){
		this.card.health = health
		this.card.totalHealth = Math.max(this.card.totalHealth, this.card.health)
		if (!this.card.health)
			this.destroy()
	}

	silence(silencer){
		let interrupted = this.player.game.eventEmitter.emit('willBeSilenced', {minion: this})
		if (interrupted)
			return
		const originalCard = cards.find(e => e.id == this.card.id)
		this.enchantments.push(silencer)
		this.card.stealth = this.card.divineShield = this.card.battlecry = 
		this.card.charge = this.card.chooseOne = this.card.deathrattle = 
		this.card.enrage = this.card.spellPower = this.card.stealth = 
		this.card.taunt = this.card.windfury = this.card.freeze = this.card.frozen = false
		this.card.silence = true
		this.canAttack = 0
		this.card.attack = originalCard.attack
		this.card.totalHealth = originalCard.totalHealth
		this.card.health = Math.min(this.card.health, this.originalCard.totalHealth)
		this.player.game.eventEmitter.removeInterruptorByCard(this.card)
		this.player.game.eventEmitter.emit('wasSilenced', {minion: this})
	}

	canBeAttacked(){
		return !this.card.stealth && !this.card.immune && (this.card.taunt || !this.player.battlefield.minions.some(minion => minion.card.taunt))
	}

	heal(hp){
		const oldHealth = this.card.health
		let interrupted = this.player.game.eventEmitter.emit('willBeHealed', {target: this})
		if (interrupted)
			return
		this.card.health = Math.min(this.card.health+hp, this.card.totalHealth)

		if (this.card.health - oldHealth){
			this.player.game.eventEmitter.emit('wasHealed', {target: this, hp: this.card.health - oldHealth})

			// Remove enrage

			if (this.card.enrage && this.card.health === this.card.totalHealth)
				this.card.attack -= this.card.enrage
		}
	}

	dealDamages(damages){
		if (this.card.immune)
			throw new Error('Target immune.')
		let interrupted = this.player.game.eventEmitter.emit('willBeDealtDamages', {target: this, damages: damages})
		if (interrupted)
			return
		if (this.card.divineShield)
			return this.card.divineShield = false
		this.card.health -= damages
		interrupted = this.player.game.eventEmitter.emit('wasDealtDamages', {target: this, damages: damages})
		if (interrupted)
			return
		if (this.card.health > 0){

			// Enrage

			if (this.card.health + damages === this.card.totalHealth && this.card.enrage)
				this.card.attack += this.card.enrage
			return
		}
		this.destroy()
	}

	attack(target){
		if (this.canAttack == 0)
			throw new Error('Can\'t attack yet/anymore')
		if (this.card.frozen)
			throw new Error('Can\'t attack when frozen.')
		if (!target.canBeAttacked())
			throw new Error('Target can\'t be attacked.')
		this.canAttack--
		this.attacked = true
		let interrupted = this.player.game.eventEmitter.emit('willAttack', {target: target, damages: this.card.attack, attacker: this})
		if (interrupted)
			return
		target.dealDamages(this.card.attack)
		if (this.card.freeze)
			target.freeze()
		if (this.card.poisonous && target instanceof Minion)
			target.destroy()
		if (target instanceof Minion){
			this.dealDamages(target.card.attack)
			if (target.card.freeze)
				this.freeze()
			if (target.card.poisonous)
				this.card.destroy()
		}
		this.player.game.eventEmitter.emit('attacked', {target: target, attacker: this, damages: this.card.attack})
	}

	destroy(){
		let interrupted = this.player.game.eventEmitter.emit('willBeDestroyed', {minion: this})
		if (interrupted)
			return
		while(this.enchantments.length)
			this.player.graveyard.add(this.enchantments.pop())
		this.player.battlefield.removeMinion(this)
		if (this.card.deathrattle)
			this.card.deathrattle({player: this.player, minion: this})
		this.player.game.eventEmitter.removeInterruptorByCard(this.card)
		this.player.graveyard.add(this)
		this.player.game.eventEmitter.emit('wasDestroyed', {minion: this})
	}

	freeze(){
		let interrupted = this.player.game.eventEmitter.emit('willBeFrozen', {target: this})
		if (interrupted)
			return
		this.card.frozen = true
		this.player.game.eventEmitter.emit('wasFrozen', {target: this})
	}

	sendBackToHand(){
		let interrupted = this.player.game.eventEmitter.emit('willBeSentBackToEnd', {minion: this})
		if (interrupted)
			return
		this.player.game.eventEmitter.removeInterruptorByCard(this.card)
		this.player.hand.takeCard(Cards.copy(Cards[this.card.id]))
		this.player.battlefield.splice(this.player.battlefield.minions.indexOf(this), 1)
		this.player.game.eventEmitter.emit('wasSentBackToEnd', {minion: this})
	}

	enchant(enchantment){

		let interrupted = this.player.game.eventEmitter.emit('willBeEnchanted', {minion: this, by: enchantment})
		if (interrupted)
			return

		this.enchantments.push(enchantment)

		enchantment.effect(this)

		this.player.game.eventEmitter.emit('wasEnchanted', {minion: this, by: enchantment})
	}

	get id(){
		return this.card.cardName
	}

	get position(){
		this.player.battlefield.minions.forEach((minion, index) => {
			if (minion == this)
				return index
		})
		return -1
	}

	status(){
		return `${this.card.cardName} - ${this.card.attack}/${this.card.health}\n`+this.enchantments.map(enchantment => enchantment.cardName).join('\n')+'////////\n'
	}

}

module.exports = Minion