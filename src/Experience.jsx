import * as THREE from "three";
import { Physics } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Environment, OrthographicCamera } from "@react-three/drei";
import { useState, useRef } from "react";

import Debugger from "./Utils/Debugger.jsx";
import Performance from "./Utils/Performance.jsx";
import Level from "./Level.jsx";
import Lights from "./Lights.jsx";
import CharacterController from "./CharacterController.jsx";
import CameraController from "./CameraController.jsx";
import useGame from "./Stores/useGame.js";

export default function Experience() {
	const blocksCount = useGame((state) => state.blocksCount);

	useFrame(() => {});

	return (
		<>
			<color attach="background" args={["#bdedfc"]} />
			{/* <Environment preset="city" /> */}
			<directionalLight
				intensity={0.3}
				castShadow
				position={[-15, 10, 15]}
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				shadow-bias={-0.00005}
			>
	
			</directionalLight>
			<Physics >
				<Performance />
				<Lights />
				<Level trapCount={blocksCount} />
				<CharacterController />
				<CameraController />
			</Physics>
			<Debugger />
		</>
	);
}
