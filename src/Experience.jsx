import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import { Physics } from "@react-three/rapier";
import { useState } from "react";
import { useControls } from "leva";

import { Level } from "./Level.jsx";
import Performance from "./Utils/Performance.jsx";
import Player from "./Player.jsx";
import useGame from "./Stores/useGame.js";

export default function Experience() {
	const blocksCount = useGame((state) => state.blocksCount);
	const blocksSeed = useGame((state) => state.blocksSeed);
	const [physicsWireFrame, setPhysicsWireFrame] = useState(false);

	useControls("Performance", {
		PhysicsWireframe: {
			value: physicsWireFrame,
			onChange: (v) => setPhysicsWireFrame(v),
		},
	});
	return (
		<>
		<color attach="background" args={['#bdedfc']} />
			<Physics debug={physicsWireFrame}>
				<Performance />
				<OrbitControls makeDefault />
				<Lights />
				<Level trapCount={blocksCount} seed={blocksSeed}/>
				<Player />
			</Physics>
		</>
	);
}
