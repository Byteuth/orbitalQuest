import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import { Physics } from "@react-three/rapier";
import { useState } from "react";

import { Level } from "./Level.jsx";
import Performance from "./Utils/Performance.jsx";
import Player from "./Player.jsx";
import useGame from "./Stores/useGame.js";

export default function Experience() {
	const blocksCount = useGame((state) => state.blocksCount);
	const blocksSeed = useGame((state) => state.blocksSeed);
	const [physicsWireFrame, setPhysicsWireFrame] = useState(false);


	return (
		<>
		<color attach="background" args={['#bdedfc']} />
			<Physics >
				{/* <Performance /> */}
				<OrbitControls makeDefault />
				<Lights />
				<Level trapCount={blocksCount} seed={blocksSeed}/>
				<Player />
			</Physics>
		</>
	);
}
