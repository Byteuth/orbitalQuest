import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export default create(
	subscribeWithSelector((set) => {
		return {
			blocksCount: 10,
			characterPosition: { x: 0, y: 0, z: 0 },
			characterRotation: 0,
			phase: "ready",
			startTime: 0,
			endTime: 0,

			start: () => {
				set((state) => {
					if (state.phase === "ready") {
						return { phase: "playing", startTime: Date.now() };
					}
					return {};
				});
			},
			restart: () => {
				set((state) => {
					if (state.phase === "playing" || state.phase === "ended") {
						return { phase: "ready", blocksSeed: Math.random() };
					}
					return {};
				});
			},
			end: () => {
				set((state) => {
					if (state.phase === "playing") {
						return { phase: "ended", endTime: Date.now() };
					}
					return {};
				});
			},

			updateCharacterPosition: (newPosition) =>
				set((state) => ({
					characterPosition: {
						x: newPosition.x,
						y: newPosition.y,
						z: newPosition.z,
					},
				})),
			updateCharacterRotation: (rotation) =>
				set({ characterRotation: rotation }),
		};
	})
);
