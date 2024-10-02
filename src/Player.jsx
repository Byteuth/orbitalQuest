import { useRapier, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import useGame from "./Stores/useGame.js";

export default function Player() {
	const [subscribeKeys, getKeys] = useKeyboardControls();
	const player = useRef();
	const { rapier, world } = useRapier();
	const start = useGame((state) => state.start);
	const end = useGame((state) => state.end);
	const restart = useGame((state) => state.restart);
	const blocksCount = useGame((state) => state.blocksCount);

	const [smoothCameraPosition, setSmoothCameraPosition] = useState(
		() => new THREE.Vector3(10, 10, 10)
	);
	const [smoothCameraTarget, setSmoothCameraTarget] = useState(
		() => new THREE.Vector3(0, 0, 0)
	);

	const jump = () => {
		const origin = player.current.translation();
		origin.y -= 0.31;

		const direction = { x: 0, y: -1, z: 0 };
		const ray = new rapier.Ray(origin, direction);
		const hit = world.castRay(ray, 10, true);

		if (hit.timeOfImpact < 0.15) {
			player.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
		}
	};

	const resetPosition = () => {
		player.current.setTranslation({ x: 0, y: 1, z: 0 });
		player.current.setLinvel({ x: 0, y: 0, z: 0 });
		player.current.setAngvel({ x: 0, y: 0, z: 0 });
	};
	
	// keys effects
	useEffect(() => {
		const unsubscribeReset = useGame.subscribe(
			(state) => state.phase,
			(value) => {
				if (value === "ready") {
					resetPosition();
				}
			}
		);

		const unsubscribeJump = subscribeKeys(
			(state) => state.jump,
			(value) => {
				if (value) jump();
			}
		);
		const unsubscribeAnyKey = subscribeKeys(() => start());

		return () => {
			unsubscribeJump();
			unsubscribeAnyKey();
			unsubscribeReset()

		};
	}, []);

	useFrame((state, delta) => {
		const { forward, backward, leftward, rightward } = getKeys();

		const impulse = { x: 0, y: 0, z: 0 };
		const torque = { x: 0, y: 0, z: 0 };

		const impulseFactor = delta * 0.6;
		const torqueFactor = delta * 0.2;

		if (forward) {
			impulse.z -= impulseFactor;
			torque.x -= torqueFactor;
		}

		if (rightward) {
			impulse.x += impulseFactor;
			torque.z -= torqueFactor;
		}

		if (backward) {
			impulse.z += impulseFactor;
			torque.x += torqueFactor;
		}

		if (leftward) {
			impulse.x -= impulseFactor;
			torque.z += torqueFactor;
		}

		player.current.applyImpulse(impulse);
		player.current.applyTorqueImpulse(torque);

		const playerPosition = player.current.translation();
		const cameraPosition = new THREE.Vector3();
		cameraPosition.copy(playerPosition);
		cameraPosition.z += 2.25;
		cameraPosition.y += 0.65;

		const cameraTarget = new THREE.Vector3();
		cameraTarget.copy(playerPosition);
		cameraTarget.y += 0.25;

		smoothCameraPosition.lerp(cameraPosition, delta * 5);
		smoothCameraTarget.lerp(cameraTarget, delta * 5);

		state.camera.position.copy(smoothCameraPosition);
		state.camera.lookAt(smoothCameraTarget);

		if (playerPosition.z < -(blocksCount * 4 + 2)) {
			end();
		}

		if (playerPosition.y < -4) {
			restart();
		}
	});

	return (
		<RigidBody
			ref={player}
			canSleep={false}
			colliders="ball"
			restitution={0.2}
			friction={1}
			position={[0, 1, 0]}
			linearDamping={1}
			angularDamping={0.5}
		>
			<mesh castShadow>
				<icosahedronGeometry args={[0.3, 1]} />
				<meshStandardMaterial flatShading color="mediumpurple" />
			</mesh>
		</RigidBody>
	);
}
