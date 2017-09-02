const CardTypes = require('./cardTypes')
const CardSets = require('./cardSets')
const Rarities = require('./rarities')
const Classes = require('./classes')
const Factions = require('./factions')
const Races = require('./races')

//	TOKEN: {
//		id: int
//		health: int
//		attack: int
//		cost: int
//		cardSet: string
//		cardTextInHand: string
//		cardName: string
//		durability: int
//		class: string
//		race: string
//		faction: string
//		cardType: string
//		rarity: string
//		attackVisualType: int
//		cardTextInPlay: string
//		devState: int
//		targetingArrowText: string
//		enchantmentBirthVisual: int
//		enchantmentIdleVisual: int
//		artistName: string
//		flavorText: string
//		howToGetThisGoldCard: string
//		howToGetThisCard: string
//		image: string
//		goldImage: string
//	}

const Cards = {
	copy: card => Object.assign({}, card),
	COIN: {
		id: 'COIN',
		cardName: 'Coin',
		cardType: CardTypes.SPELL,
		cost: 0,

		effect: data => (data.player.availableMana < 10) ? data.player.availableMana++ : false,

		cardTextInPlay: 'Give a free mana for this turn.', flavorText: '~',
		cardSet: CardSets.BASIC, rarity: Rarities.FREE,
		cardTextInHand: '+1 mana',
		artistName: 'n/a', image: 'n/a', goldImage: 'n/a'
	},
	FIREBLAST: {
		id: 'FIREBLAST',
		cardName: 'Fireblast',
		cardType: CardTypes.HERO_POWER,
		cost: 2,
		effect: data => data.target.dealDamages(2),
		target: 'any'
	},
	ARCANE_MISSILES: {
		id: 'ARCANE_MISSILES',
		cardName: 'Arcane Missiles',
		cardType: CardTypes.SPELL,
		cost: 1,
		effect: data => {
			const enemy = this.opponent
			for (let i = 0; i<3+data.player.spellPower; i++){
				const possibleTargets = [enemy, ...enemy.battlefield.minions]
				const randomTarget = possibleTargets[Math.floor(Math.random()*possibleTargets.length)]
				randomTarget.dealDamages(1)
			}
		}
	},
	FROSTBOLT: {
		id: 'FROSTBOLT',
		cardName: 'Frostbolt',
		cardType: CardTypes.SPELL,
		cost: 1,
		effect: data => {
			data.target.dealDamages(3+spellPower)
			data.target.card.freeze()
		},
		target: 'any'
	},
	ARCANE_INTELLECT: {
		id: 'ARCANE_INTELLECT',
		cardName: 'Arcane Intellect',
		cardType: CardTypes.SPELL,
		cost: 3,
		effect: data => {
			data.player.hand.drawCards(3)
		}
	},
	FIREBALL: {
		id: 'FIREBALL',
		cardName: 'Fireball',
		cardType: CardTypes.SPELL,
		cost: 4,
		effect: data => {
			data.target.dealDamages(6+data.player.spellPower)
		},
		target: 'any'
	},
	SHEEP: {
		id: 'SHEEP',
		cardName: 'Sheep',
		cardType: CardTypes.MINION,
		health: 1,
		attack: 1,
		cost: 1,

		battlecry: false, charge: false, chooseOne: false, // [id1, id2, ...]
		deathrattle: false, divineShield: false, enrage: false,
		spellPower: 0, silence: false, stealth: false, taunt: false,
		windfury: false, freeze: false, poisonous: false, target: false, // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'
	},
	POLYMORPH: {
		id: 'POLYMORPH',
		cardName: 'Polymorph',
		cardType: CardTypes.SPELL,
		cost: 4,
		effect: data => {
			data.target.player.battlefield.minions[data.target.position()] = new Minion(Cards.SHEEP)
		},
		target: 'minion'
	},
	WATER_ELEMENTAL: {
		id: 'WATER_ELEMENTAL',
		cardName: 'Water Elemental',
		cardType: CardTypes.MINION,
		health: 6,
		attack: 3,
		cost: 3,

		battlecry: false, charge: false, chooseOne: false, // [id1, id2, ...]
		deathrattle: false, divineShield: false, enrage: false,
		spellPower: 0, silence: false, stealth: false, taunt: false,
		windfury: false, freeze: true, poisonous: false, target: false, // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'
	},
	FLAMESTRIKE: {
		id: 'FLAMESTRIKE',
		cardName: 'Flamestrike',
		cardType: CardTypes.SPELL,
		cost: 7,
		effect: data => {
			data.player.opponent.battlefield.minions.forEach(
				minion => minion.dealDamages(4+data.player.spellPower)
			)
		}
	},
	ACIDIC_SWAMP_OOZE: {
		id: 'ACIDIC_SWAMP_OOZE',
		cardName: 'Acidic Swamp Ooze',
		cardType: CardTypes.MINION,
		health: 2,
		attack: 3,
		cost: 2,

		battlecry: data => data.player.opponent.Weapon = null, 
		charge: false, chooseOne: false, // [id1, id2, ...]
		deathrattle: false, divineShield: false, enrage: false,
		spellPower: 0, silence: false, stealth: false, taunt: false,
		windfury: false, freeze: false, poisonous: false, target: false, // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'
	},
	BLOODFEN_RAPTOR: {
		id: 'BLOODFEN_RAPTOR',
		cardName: 'Bloodfen Raptor',
		cardType: CardTypes.MINION,
		health: 2,
		attack: 3,
		cost: 2,

		battlecry: false, charge: false, chooseOne: false, // [id1, id2, ...]
		deathrattle: false, divineShield: false, enrage: false,
		spellPower: 0, silence: false, stealth: false, taunt: false,
		windfury: false, freeze: false, poisonous: false, target: false, // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'
	},
	IRONFUR_GRIZZLY: {
		id: 'IRONFUR_GRIZZLY',
		cardName: 'Ironfur Grizzly',
		cardType: CardTypes.MINION,
		health: 3,
		attack: 3,
		cost: 3,

		battlecry: false, charge: false, chooseOne: false, // [id1, id2, ...]
		deathrattle: false, divineShield: false, enrage: false,
		spellPower: 0, silence: false, stealth: false, taunt: true,
		windfury: false, freeze: false, poisonous: false, target: false, // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'
	},
	SHATTERED_SUN_CLERIC: {
		id: 'SHATTERED_SUN_CLERIC',
		cardName: 'Shattered Sun Cleric',
		cardType: CardTypes.MINION,
		health: 2,
		attack: 3,
		cost: 3,

		battlecry: data => {if (data.target) data.target.give(1,1)}, 

		charge: false, chooseOne: false, // [id1, id2, ...]
		deathrattle: false, divineShield: false, enrage: false,
		spellPower: 0, silence: false, stealth: false, taunt: false,
		windfury: false, freeze: false, poisonous: false, 

		target: 'friendlyMinion', // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'
	},
	CHILLWIND_YETI: {
		id: 'CHILLWIND_YETI',
		cardName: 'Chillwind Yeti',
		cardType: CardTypes.MINION,
		health: 5,
		attack: 4,
		cost: 4,

		battlecry: false, charge: false, chooseOne: false, // [id1, id2, ...]
		deathrattle: false, divineShield: false, enrage: false,
		spellPower: 0, silence: false, stealth: false, taunt: false,
		windfury: false, freeze: false, poisonous: false, target: false, // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'
	},
	GNOMISH_INVENTOR: {
		id: 'GNOMISH_INVENTOR',
		cardName: 'Gnomish Inventor',
		cardType: CardTypes.MINION,
		health: 4,
		attack: 2,
		cost: 4,

		battlecry: data => data.player.hand.drawCard(), 

		charge: false, chooseOne: false, // [id1, id2, ...]
		deathrattle: false, divineShield: false, enrage: false,
		spellPower: 0, silence: false, stealth: false, taunt: false,
		windfury: false, freeze: false, poisonous: false, target: false, // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'
	},
	SENJIN_SHIELDMASTA: {
		id: 'SENJIN_SHIELDMASTA',
		cardName: 'Sen\'jin Shieldmasta',
		cardType: CardTypes.MINION,
		health: 5,
		attack: 3,
		cost: 4,

		battlecry: false, charge: false, chooseOne: false, // [id1, id2, ...]
		deathrattle: false, divineShield: false, enrage: false,
		spellPower: 0, silence: false, stealth: false, taunt: true,
		windfury: false, freeze: false, poisonous: false, target: false, // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'
	},
	BOULDERFIST_OGRE: {
		id: 'BOULDERFIST_OGRE',
		cardName: 'Boulderfist Ogre',
		cardType: CardTypes.MINION,
		health: 7,
		attack: 6,
		cost: 6,

		battlecry: false, charge: false, chooseOne: false, // [id1, id2, ...]
		deathrattle: false, divineShield: false, enrage: false,
		spellPower: 0, silence: false, stealth: false, taunt: false,
		windfury: false, freeze: false, poisonous: false, target: false, // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'
	},
	WEAPON: {
		id: 'WEAPON',
		cardName: 'Dangerous Weapon',
		cardType: CardTypes.WEAPON,
		attack: 1,
		durability: 1
	}
}

module.exports = Cards