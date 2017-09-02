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
			data.target.dealDamages(3+data.player.spellPower)
			data.target.freeze()
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
		cost: 1,
		attack: 1,
		health: 1,
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
		cost: 3,
		attack: 3,
		health: 6,

		freeze: true
	},
	FLAMESTRIKE: {
		id: 'FLAMESTRIKE',
		cardName: 'Flamestrike',
		cardType: CardTypes.SPELL,
		cost: 7,
		effect: data => {
			// foreEach can't iterate over an array while destoying it, we use a copy.
			let enemyMinions = data.player.opponent.battlefield.minions.slice()
			enemyMinions.forEach(
				minion => minion.dealDamages(4+data.player.spellPower)
			)
		}
	},
	ACIDIC_SWAMP_OOZE: {
		id: 'ACIDIC_SWAMP_OOZE',
		cardName: 'Acidic Swamp Ooze',
		cardType: CardTypes.MINION,
		cost: 2,
		attack: 3,
		health: 2,

		battlecry: data => data.player.opponent.Weapon = null, 
	},
	BLOODFEN_RAPTOR: {
		id: 'BLOODFEN_RAPTOR',
		cardName: 'Bloodfen Raptor',
		cardType: CardTypes.MINION,
		cost: 2,
		attack: 3,
		health: 2,
	},
	IRONFUR_GRIZZLY: {
		id: 'IRONFUR_GRIZZLY',
		cardName: 'Ironfur Grizzly',
		cardType: CardTypes.MINION,
		health: 3,
		attack: 3,
		cost: 3,

		taunt: true
	},
	SHATTERED_SUN_CLERIC: {
		id: 'SHATTERED_SUN_CLERIC',
		cardName: 'Shattered Sun Cleric',
		cardType: CardTypes.MINION,
		cost: 3,
		attack: 3,
		health: 2,

		battlecry: data => {if (data.target) data.target.give(1,1)}, 

		target: 'friendlyMinion', // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'
	},
	CHILLWIND_YETI: {
		id: 'CHILLWIND_YETI',
		cardName: 'Chillwind Yeti',
		cardType: CardTypes.MINION,
		cost: 4,
		attack: 4,
		health: 5,
	},
	GNOMISH_INVENTOR: {
		id: 'GNOMISH_INVENTOR',
		cardName: 'Gnomish Inventor',
		cardType: CardTypes.MINION,
		cost: 4,
		attack: 2,
		health: 4,

		battlecry: data => data.player.hand.drawCard(), 
	},
	SENJIN_SHIELDMASTA: {
		id: 'SENJIN_SHIELDMASTA',
		cardName: 'Sen\'jin Shieldmasta',
		cardType: CardTypes.MINION,
		cost: 4,
		attack: 3,
		health: 5,

		taunt: true
	},
	BOULDERFIST_OGRE: {
		id: 'BOULDERFIST_OGRE',
		cardName: 'Boulderfist Ogre',
		cardType: CardTypes.MINION,
		cost: 6,
		attack: 6,
		health: 7,
	},
	WEAPON: {
		id: 'WEAPON',
		cardName: 'Dangerous Weapon',
		cardType: CardTypes.WEAPON,
		cost: 1,
		attack: 1,
		durability: 1
	}
}

module.exports = Cards