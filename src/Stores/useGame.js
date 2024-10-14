import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export default create(
	subscribeWithSelector((set) => ({
		keys: {
			forward: false,
			backward: false,
			leftward: false,
			rightward: false,
			jump: false,
			run: false,
			action1: false,
			action2: false,
			action3: false,
			action4: false,
		},
		spellDetails: null,
		castingSpell: false,

		// Setter for individual keys
		setKey: (key, value) =>
			set((state) => ({
				keys: { ...state.keys, [key]: value },
			})),

		// Setter for spell details
		setSpellDetails: (spellDetails) =>
			set((state) => ({
				spellDetails: spellDetails,
			})),
	}))
);
