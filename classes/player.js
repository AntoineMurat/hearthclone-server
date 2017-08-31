const Battlefield = require('./battlefield')
const Hand = require('./hand')
const Library = require('./library')
const Graveyard = require('./graveyard')
const Secrets = require('./secrets')

const Classes = require('./../enums/classes')
const Cards = require('./../enums/cards')

class Player {

	constructor(game, client, deck = Array(20).fill(), playerClass = Classes.MAGE, startingHp = 30, totalMana = 0){

		this.game = game
		this.client = client
		this.class = playerClass

		deck = deck.map(e => Object.assign({},Cards.TOKEN)) 
		this.deck = deck

		this.battlefield = new Battlefield(this)
		this.hand = new Hand(this)
		this.library = new Library(this, this.deck)
		this.graveyard = new Graveyard(this)
		this.secrets = new Secrets(this)

		this.startingHp = startingHp
		this.hp = startingHp
		this.shield = 0
		this.immune = false

		this.totalMana = totalMana
		this.availableMana = totalMana
		this.overload = 0

		this.weapon = null
		this.weaponAlreadyUsed = false
		this.heroPower = Object.assign({}, Cards.HERO_POWER)
		this.heroPowerAlreadyUsed = false

		this.isHisTurn = false
		this.hand.drawCards(3)

		// Should setup some listeners
	}

	newTurn(){
		this.hand.drawCard()
		this.weaponAlreadyUsed = this.heroPowerAlreadyUsed = false
		this.totalMana = Math.min(this.totalMana+1, 10)
		this.availableMana = this.totalMana - this.overload
		this.overload = 0
		this.immune = false
		this.battlefield.minions.forEach(minion => minion.reset())

		this.isHisTurn = true
		this.game.eventEmitter.emit('newTurn', {player: this})

		this.automaticEndOfTurn = setTimeout(_ => this.endTurn(), 75000)
	}

	endTurn(){

		clearTimeout(this.automaticEndOfTurn)
		this.isHisTurn = false
		this.game.eventEmitter.emit('endOfTurn', {player: this})
		this.game.opponentOf(this).newTurn()

	}

	play(data){
		if (!this.isHisTurn)
			throw new Error('Not your turn.')
		if (typeof data.action === 'undefined')
			throw new Error('No action specified.')
		switch (data.action){
			case 'endTurn':
				this.endTurn()
				break
			case 'playCard':
				this.playCard(data.index, data)
				break
			case 'useHeroPower':
				this.useHeroPower(data)
				break
			case 'useWeapon':
				this.useWeapon(data)
				break
			case 'attackWithMinion':
				if (data.on !== 'hero' || data.on !== 'minion')
					throw new Error('On should be either "hero" or "minion".')
				if (data.on === 'hero')
					target = this.game.opponentOf(this)
				else 
					target = this.game.opponentOf(this).battlefield.getMinionById(data.index)
				this.battlefield.getMinionById(data.with).attack(target)
				break
			default:
				throw new Error('Unknow action.')
		}
	}

	canBeAttacked(){
		return !this.immune && !this.battlefield.minions.some(minion => minion.taunt)
	}

	dealDamages(damages){
		if (this.immune)
			throw new Error('Target is immune')
		this.shield -= damages
		if (shield > 0)
			return
		damages = -shield
		shield = 0
		this.hp -= damages
		this.game.eventEmitter.emit('wasDealtDaamges', {target: this, damages: damages})
		if (this.hp > 0)
			return
		this.game.won(this.game.opponentOf(this))
	}

	heal(hp){
		const oldHp = this.hp
		this.hp = min(this.startingHp, this.hp+hp)
		this.game.eventEmitter.emit('wasHealed', {target: this, damages: this.hp - this.oldHp})
	}

	playCard(index, data = {}){
		return this.hand.playCardByIndex(index, data)
	}

	useHeroPower(data){
		if (this.heroPowerAlreadyUsed)
			throw new Error('Hero power already used.')
		this.heroPowerAlreadyUsed = true
		return this.playCard(this.heroPower, data)
	}

	useWeapon(data){
		if (this.weapon === null)
			throw new Error('No weapon equiped.')
		if (this.weaponAlreadyUsed)
			throw new Error('Weapon already used.')
		if (data.on !== 'hero' || data.on !== 'minion')
			throw new Error('On should be either "hero" or "minion".')
		if (data.on === 'hero')
			target = this.game.opponentOf(this)
		else 
			target = this.game.opponentOf(this).battlefield.getMinionById(data.index)
		if (!this.target.canBeAttacked)
			throw new Error('The target can\'t be attacked.')
		this.weaponAlreadyUsed = true
		target.dealDamages(this.weapon.attack)
		if (!this.weapon.durability--)
			this.weapon = null
	}

	act(effect, data){
		effect(data)
	}

	playCard(card, data = {}){
		if (this.availableMana - card.cost < 0)
			throw new Error('Not enough mana.')

		// Could be exploited if error thrown afterwards.
		this.availableMana -= card.cost

		if (cardToPlay.cardType === CardTypes.MINION)
			return this.playMinion(card, data)

		if (cardToPlay.cardType === CardTypes.SPELL)
			return this.playSpell(card, data)

		if (cardToPlay.cardType === CardTypes.ENCHANTMENT)
			return this.playEnchantment(card, data)

		if (cardToPlay.cardType === CardTypes.WEAPON)
			return this.playWeapon(card)

		if (cardToPlay.cardType === CardTypes.HERO_POWER)
			return this.playHeroPower(card, data)
	}

	playMinion(minion, data = {}){
		if (battlefield.minions.length>=7)
			throw new Error('Battlefield full')
		if (minion.battlecry){
			const battlecry = minion.battlecry
			battlecry(data)
		}
		if (minion.chooseOne)
			minion = minion.chooseOne(data)
		this.battlefield.newMinion(this, minion)
	}

	playSpell(spell, data = {}){
		if (spell.secretConditions){
			if (!this.secrets.canBePlayed(spell))
				throw new Error('This secret can\'t be played: already in game.')
			this.secrets.add(spell)
			return
		}

		const effect = spell.effect
		effect(data)
		this.graveyard.add(spell)
	}

	playEnchantment(enchantment, data = {}){
		if (!data.target)
			throw new Exception('Missing target.')
		data.target.enchant(enchantment)
	}

	playWeapon(weapon, data = {}){
		this.weapon = weapon
	}

	playHeroPower(heroPower, data = {}){
		const effect = heroPower.effect

		effect(data)
	}


}

module.exports = Player