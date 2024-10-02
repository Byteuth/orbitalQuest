import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float, Text } from "@react-three/drei";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({
	color: "limegreen",
});
const floor2Material = new THREE.MeshStandardMaterial({
	color: "greenYellow",
});
const obstacleMaterial = new THREE.MeshStandardMaterial({
	color: "orangered",
});
const wallMaterial = new THREE.MeshStandardMaterial({
	color: "slategrey",
});

export function BlockStart({ position = [0, 0, 0] }) {
	return (
		<group position={position}>
			<Float float floatIntensity={0.25}>
				<Text
					font="./bebas-neue-v9-latin-regular.woff"
					scale={0.5}
					maxWidth={0.25}
					lineHeight={0.75}
					textAlign="right"
					position={[0.75, 0.65, -0.5]}
					rotation-y={-0.25}
				>
					lil game
					<meshBasicMaterial toneMapped={false} />
				</Text>
			</Float>
			<mesh
				geometry={boxGeometry}
				material={floor1Material}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>
		</group>
	);
}

export function BlockEnd({ position = [0, 0, 0] }) {
	const model = useGLTF("./hamburger.glb");
	model.scene.children.forEach((mesh) => (mesh.castShadow = true));

	return (
		<group position={position}>
			<Text
				font="./bebas-neue-v9-latin-regular.woff"
				scale={1}
				position={[0, 2.25, 2]}
			>
				FINISH
				<meshBasicMaterial toneMapped={false} />
			</Text>
			<mesh
				geometry={boxGeometry}
				material={floor1Material}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>
			<RigidBody
				type="fixed"
				colliders="hull"
				position={[0, 0.25, 0]}
				restitution={0.2}
				friction={0}
			>
				<primitive object={model.scene} scale={0.25} />
			</RigidBody>
		</group>
	);
}

export function BlockTrapSpinner({ position = [0, 0, 0] }) {
	const [speed, setSpeed] = useState(() => {
		return (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1);
	});

	const obstacle = useRef();

	useFrame((state) => {
		const time = state.clock.getElapsedTime();

		const rotation = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(0, time * speed, 0)
		);
		obstacle.current.setNextKinematicRotation(rotation);
	}, []);

	return (
		<group position={position}>
			<RigidBody type="fixed">
				<mesh
					geometry={boxGeometry}
					material={floor2Material}
					position={[0, -0.1, 0]}
					scale={[4, 0.2, 4]}
					receiveShadow
				/>
			</RigidBody>
			<RigidBody
				ref={obstacle}
				type="kinematicPosition"
				restitution={0.2}
				friction={0.0}
			>
				<mesh
					geometry={boxGeometry}
					material={obstacleMaterial}
					position={[0, 0.5, 0]}
					scale={[3.5, 0.3, 0.3]}
					castShadow
				/>
			</RigidBody>
		</group>
	);
}

export function BlockTrapUpDown({ position = [0, 0, 0] }) {
	const [timeOffset, setTimeOffset] = useState(() => {
		return Math.random() * Math.PI * 2;
	});

	const obstacle = useRef();

	useFrame((state) => {
		const time = state.clock.getElapsedTime();
		const y = Math.sin(time + timeOffset) + 1.05;
		// const z = Math.cos(time);

		obstacle.current.setNextKinematicTranslation({
			x: position[0],
			y,
			z: position[2],
		});
	}, []);

	return (
		<group position={position}>
			<RigidBody type="fixed">
				<mesh
					geometry={boxGeometry}
					material={floor2Material}
					position={[0, -0.1, 0]}
					scale={[4, 0.2, 4]}
					receiveShadow
				/>
			</RigidBody>
			<RigidBody
				ref={obstacle}
				type="kinematicPosition"
				restitution={0.2}
				friction={0.0}
			>
				<mesh
					geometry={boxGeometry}
					material={obstacleMaterial}
					position={[0, 0.5, 0]}
					scale={[3.5, 0.3, 0.3]}
					castShadow
				/>
			</RigidBody>
		</group>
	);
}

export function BlockTrapAxe({ position = [0, 0, 0] }) {
	const [speed, setSpeed] = useState(() => {
		return (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1);
	});

	const obstacle = useRef();

	useFrame((state) => {
		const time = state.clock.getElapsedTime();
		const angle = Math.PI * 1;
		const z = Math.sin(time + speed) + angle;

		const rotation = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(0, 0, z)
		);

		obstacle.current.setNextKinematicRotation(rotation);
	}, []);

	return (
		<group position={position}>
			<RigidBody type="fixed">
				<mesh
					geometry={boxGeometry}
					material={floor2Material}
					position={[0, -0.1, 0]}
					scale={[4, 0.2, 4]}
					receiveShadow
				/>
			</RigidBody>
			<RigidBody
				ref={obstacle}
				type="kinematicPosition"
				restitution={0.2}
				friction={0.0}
				position={[0, 2, 0]}
			>
				<mesh
					geometry={boxGeometry}
					material={obstacleMaterial}
					position={[0, 1, 0]}
					scale={[1, 1, 0.3]}
					castShadow
				/>
				<mesh
					geometry={boxGeometry}
					material={obstacleMaterial}
					position={[0, 1.5, 0]}
					scale={[3, 0.5, 0.3]}
					castShadow
				/>
			</RigidBody>
		</group>
	);
}

function Bounds({ length = 1 }) {
	return (
		<>
			<RigidBody type="fixed">
				<mesh
					position={[2.15, 0.75, -(length * 2) + 2]}
					geometry={boxGeometry}
					material={wallMaterial}
					scale={[0.3, 1.5, 4 * length]}
					castShadow
				/>
				<mesh
					position={[-2.15, 0.75, -(length * 2) + 2]}
					geometry={boxGeometry}
					material={wallMaterial}
					scale={[0.3, 1.5, 4 * length]}
					receiveShadow
				/>
				<mesh
					position={[0, 0.75, -(length * 4) + 2]}
					geometry={boxGeometry}
					material={wallMaterial}
					scale={[4, 1.5, 0.3]}
					receiveShadow
				/>
				<CuboidCollider
					args={[2, 0.1, 2 * length]}
					position={[0, -0.1, -(length * 2) + 2]}
					restitution={0.2}
					friction={1}
				/>
			</RigidBody>
		</>
	);
}

export function Level({
	trapCount,
	types = [BlockTrapAxe, BlockTrapSpinner, BlockTrapUpDown],
	seed,
}) {
	const blocks = useMemo(() => {
		const blocks = [];
		for (let i = 0; i < trapCount; i++) {
			const type = types[Math.floor(Math.random() * types.length)];
			blocks.push(type);
		}
		return blocks;
	}, [trapCount, types, seed]);

	return (
		<>
			<BlockStart position={[0, 0, 0]} />
			{blocks.map((Block, index) => (
				<Block key={index} position={[0, 0, -(index + 1) * 4]} />
			))}
			<BlockEnd position={[0, 0, -(trapCount + 1) * 4]} />
			<Bounds length={trapCount + 2} />
		</>
	);
}
