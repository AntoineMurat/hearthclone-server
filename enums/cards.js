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
	TOKEN: {
		id: 0,
		cardName: 'Token',
		cardType: CardTypes.MINION,
		health: 1,
		attack: 1,
		cost: 1,

		battlecry: false,
		charge: false,
		chooseOne: false,
		deathrattle: false,
		divineShield: false,
		enrage: false,
		spellPower: 0,
		silence: false,
		stealth: false,
		taunt: false,
		windfury: false,






		cardTextInPlay: 'Attaque seulement.',
		flavorText: 'Minion de base',
		cardSet: CardSets.BASIC,
		rarity: Rarities.FREE,
		cardTextInHand: 'Raccourci...',
		race: Races.MURLOC,
		faction: Factions.NEUTRAL,
		artistName: 'n/a',
		image: 'n/a',
		goldImage: 'n/a'
	},
	HERO_POWER: {
		id: 1,
		cardName: 'Hero Power',
		cardType: CardTypes.HERO_POWER,
		cost: 2,
		cardTextInPlay: 'Explosion Pyrotechnique',
		flavorText: '*poof*',
		cardSet: CardSets.BASIC,
		rarity: Rarities.FREE,
		cardTextInHand: 'Exp. pyro',
		effect: function(data){target.dealDamages(2)},
		artistName: 'n/a',
		image: 'n/a',
		goldImage: 'n/a'
	}
}

module.exports = Cards