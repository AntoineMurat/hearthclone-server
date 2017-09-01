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
	HERO_POWER: {
		id: 'HERO_POWER',
		cardName: 'Hero Power',
		cardType: CardTypes.HERO_POWER,
		cost: 2,
		cardTextInPlay: 'Explosion Pyrotechnique',
		flavorText: '*poof*',
		cardSet: CardSets.BASIC,
		rarity: Rarities.FREE,
		cardTextInHand: 'Exp. pyro',
		effect: data => data.target.dealDamages(2),
		target: 'any',
	},
	TOKEN: {
		id: 'TOKEN',
		cardName: 'Token',
		cardType: CardTypes.MINION,
		health: 1,
		attack: 1,
		cost: 1,

		battlecry: false, charge: true, chooseOne: false, // [id1, id2, ...]
		deathrattle: false, divineShield: false, enrage: false,
		spellPower: 0, silence: false, stealth: false, taunt: false,
		windfury: true, freeze: false, poisonous: false, target: false, // 'any', 'hero', 'minion', 'enemyHero', 'enemyMinion', 'firendlyHero', 'friendlyMinion'

		cardTextInPlay: 'Attaque seulement.',
		flavorText: 'Minion de base',
		cardSet: CardSets.BASIC,
		rarity: Rarities.FREE,
		cardTextInHand: 'Raccourci...',
		race: Races.MURLOC,
		faction: Factions.NEUTRAL,
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