import { ApiCard } from "@/types/apiCard";

export const elvishMystic: ApiCard = {
	id: "60d0e6a6-629a-45a7-bfcb-25ba7156788b",
	oracle_id: "3f3b2c10-21f8-4e13-be83-4ef3fa36e123",
	name: "Elvish Mystic",
	image_uris: {
		small: "https://cards.scryfall.io/small/front/6/0/60d0e6a6-629a-45a7-bfcb-25ba7156788b.jpg?1562829984",
		normal: "https://cards.scryfall.io/normal/front/6/0/60d0e6a6-629a-45a7-bfcb-25ba7156788b.jpg?1562829984",
	},
	mana_cost: "{G}",
	type_line: "Creature — Elf Druid",
	oracle_text: "{T}: Add {G}.",
	power: "1",
	toughness: "1",
	color_identity: ["G"],
	keywords: [],
	legalities: {
		standard: "not_legal",
		future: "not_legal",
		historic: "legal",
		gladiator: "legal",
		pioneer: "legal",
		explorer: "legal",
		modern: "legal",
		legacy: "legal",
		pauper: "legal",
		vintage: "legal",
		penny: "legal",
		commander: "legal",
		oathbreaker: "legal",
		brawl: "not_legal",
		historicbrawl: "legal",
		alchemy: "not_legal",
		paupercommander: "legal",
		duel: "legal",
		oldschool: "not_legal",
		premodern: "not_legal",
		predh: "not_legal",
	},
	promo: false,
	set: "m14",
	set_name: "Magic 2014",
	set_type: "core",
	rarity: "common",
	flavor_text:
		'"Life grows everywhere. My kin merely find those places where it grows strongest."\n—Nissa Revane',
	artist: "Wesley Burt",
	prices: {
		usd: "0.49",
		usd_foil: "7.77",
	},
	collector_number: "169",
	layout: "normal",
	finishes: ["nonfoil", "foil"],
};

export const nissaVastwoodSeer: ApiCard = {
	id: "008b1ea5-1a8d-4a9d-b208-421fea2f9c58",
	oracle_id: "35754a21-9fba-4370-a254-292918a777ba",
	name: "Nissa, Vastwood Seer // Nissa, Sage Animist",
	layout: "transform",
	type_line: "Legendary Creature — Elf Scout // Legendary Planeswalker — Nissa",
	color_identity: ["G"],
	keywords: ["Transform"],
	collector_number: "189",
	card_faces: [
		{
			mana_cost: "{2}{G}",
			image_uris: {
				small: "https://cards.scryfall.io/small/front/0/0/008b1ea5-1a8d-4a9d-b208-421fea2f9c58.jpg?1666871396",
				normal: "https://cards.scryfall.io/normal/front/0/0/008b1ea5-1a8d-4a9d-b208-421fea2f9c58.jpg?1666871396",
			},
		},
		{
			mana_cost: "",
			image_uris: {
				small: "https://cards.scryfall.io/small/back/0/0/008b1ea5-1a8d-4a9d-b208-421fea2f9c58.jpg?1666871396",
				normal: "https://cards.scryfall.io/normal/back/0/0/008b1ea5-1a8d-4a9d-b208-421fea2f9c58.jpg?1666871396",
			},
		},
	],
	legalities: {
		standard: "not_legal",
		future: "not_legal",
		historic: "not_legal",
		gladiator: "not_legal",
		pioneer: "legal",
		explorer: "not_legal",
		modern: "legal",
		legacy: "legal",
		pauper: "not_legal",
		vintage: "legal",
		penny: "not_legal",
		commander: "legal",
		oathbreaker: "legal",
		brawl: "not_legal",
		historicbrawl: "not_legal",
		alchemy: "not_legal",
		paupercommander: "not_legal",
		duel: "legal",
		oldschool: "not_legal",
		premodern: "not_legal",
		predh: "not_legal",
	},
	finishes: ["foil"],
	promo: true,
	set: "ps15",
	set_name: "San Diego Comic-Con 2015",
	set_type: "promo",
	rarity: "mythic",
	artist: "Wayne Reynolds",
	promo_types: ["convention"],
	prices: {
		usd: null,
		usd_foil: "70.57",
	},
};
