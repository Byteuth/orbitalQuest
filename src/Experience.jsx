import { Physics } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import Debugger from "./Utils/Debugger.jsx";
import Performance from "./Utils/Performance.jsx";
import Level from "./Level.jsx";
import Lights from "./Lights.jsx";
import CharacterController from "./CharacterController.jsx";
import useGame from "./Stores/useGame.js";

export default function Experience() {
	const blocksCount = useGame((state) => state.blocksCount);

	useFrame(() => {});

	return (
		<>
			<color attach="background" args={["#bdedfc"]} />
			<Environment preset="city" />
			<Physics >
				<Level />
				<CharacterController />
			</Physics>
			<Performance />
			<Debugger />
		</>
	);
}
