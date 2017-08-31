const cards = require('./../enums/cards')

class Minion {

	constructor(player, card){
		this.player = player
		this.card = card
		this.enchantments = []
		this.canAttack = 0
		if (this.card.charge)
			this.reset()
		this.card.totalHealth = this.health
	}

	reset(){
		this.canAttack = this.card.windfury ? 2 : 1
	}

	silence(silencer){
		const originalCard = cards.find(e => e.id == this.card.id)[0]
		this.enchantments.push(silencer)
		this.card.stealth = this.card.divineShield = this.card.battlecry = 
		this.card.charge = this.card.chooseOne = this.card.deathrattle = 
		this.card.enrage = this.card.spellPower = this.card.stealth = 
		this.card.taunt = this.card.windfury = false
		this.card.silence = true
		this.card.attack = originalCard.attack
		if (this.card.totalHealth != originalCard.totalHealth)
			this.card.totalHealth = this.originalCard.totalHealth
		this.card.health = Math.min(this.card.health, this.originalCard.totalHealth)

	}

	canBeAttacked(){
		return !this.card.stealth && !this.card.immune && (this.card.taunt || !this.battlefield.minions.some(minion => minion.taunt))
	}

	heal(hp){
		const oldHealth = this.card.health
		this.card.health = Math.min(this.card.health+hp, this.card.totalHealth)

		if (this.card.health - oldHealth)
			this.player.game.eventEmitter.emit('wasHealed', {target: this, hp: this.card.health - oldHealth})
	}

	dealDamages(damages){
		if (this.card.immune)
			throw new Error('Target immune.')
		if (this.card.divineShield)
			return this.card.divineShield = false
		this.health -= damages
		this.player.game.eventEmitter.emit('wasDealtDamages', {target: this, damages: damages})
		if (this.health > 0)
			return
		this.destroy()
	}

	attack(target){
		if (this.canAttack == 0)
			throw new Error('Can\'t attack yet/anymore')
		if (!target.canBeAttacked())
			throw new Error('Target can\'t be attacked.')
		this.target.dealDamages(this.attack)
		this.canAttack--
	}

	destroy(){
		while(this.enchantments.length)
			this.player.graveyard.add(this.enchantments.pop())
		this.player.battlefield.removeMinion(this)
		if (this.card.deathrattle)
			this.player.act(deathrattle)
	}

	enchant(enchantment){
		this.enchantments.push(enchantment)

		enchantment.effect(this)
	}

	get id(){
		return this.card.cardName
	}

	status(){
		return `${this.card.cardName} - ${this.card.attack}/${this.card.health}\n`+this.enchantments.map(enchantment => enchantment.cardName).join('\n')+'////////\n'
	}

}

module.exports = Minion