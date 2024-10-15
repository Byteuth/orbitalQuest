import { Physics } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useControls } from "leva";

import Debugger from "./Utils/Debugger.jsx";
import Performance from "./Utils/Performance.jsx";
import Level from "./Level.jsx";
import Lights from "./Lights.jsx";
import CharacterController from "./CharacterController.jsx";

export default function Experience() {
	const { physicsWireframe } = useControls('Debug',{
		physicsWireframe: false
	})
	
	return (
		<>
			<color attach="background" args={["#bdedfc"]} />
			<Environment preset="sunset" />
			<Physics debug={physicsWireframe}>
				<Level />
				<CharacterController />
			</Physics>
			<Performance />
			<Debugger />
		</>
	);
}
