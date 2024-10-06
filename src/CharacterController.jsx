import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import Character from "./Components/Character";
import useGame from "./Stores/useGame";

const normalizeAngle = (angle) => {
	while (angle > Math.PI) angle -= 2 * Math.PI;
	while (angle < -Math.PI) angle += 2 * Math.PI;
	return angle;
};

const lerpAngle = (start, end, t) => {
	start = normalizeAngle(start);
	end = normalizeAngle(end);

	if (Math.abs(end - start) > Math.PI) {
		if (end > start) {
			start += 2 * Math.PI;
		} else {
			end += 2 * Math.PI;
		}
	}

	return normalizeAngle(start + (end - start) * t);
};

export default function CharacterController() {
	const { WALK_SPEED, MAX_SPEED } = useControls("Character Control", {
		WALK_SPEED: { value: 0.5 },
		MAX_SPEED: { value: 1.5, min: 0.01, max: 5, step: 0.01 },
	});

	const rb = useRef();
	const character = useRef();
	const characterRotation = useGame((state) => state.characterRotation);
	const updateCharacterPosition = useGame(
		(state) => state.updateCharacterPosition
	);
	const { rapier, world } = useRapier();

	const [animation, setAnimation] = useState("idle");

	const [state, get] = useKeyboardControls();
	const jumpPressed = useRef(false);
	const [leftMousePressed, setLeftMousePressed] = useState(false);
	const [rightMousePressed, setRightMousePressed] = useState(false);

	
	useEffect(() => {
		const handleMouseDown = (event) => {
			if (event.button === 0) setLeftMousePressed(true); 
			if (event.button === 2) setRightMousePressed(true); 
		};

		const handleMouseUp = (event) => {
			if (event.button === 0) setLeftMousePressed(false); 
			if (event.button === 2) setRightMousePressed(false); 
		};

		window.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	const jump = () => {
		const origin = rb.current.translation();
		origin.y -= 0.31;

		const direction = { x: 0, y: -1, z: 0 };
		const ray = new rapier.Ray(origin, direction);
		const hit = world.castRay(ray, 10, true);
		if (hit.timeOfImpact < 0.05) {
			rb.current.applyImpulse({ x: 0, y: 0.05, z: 0 });
			jumpPressed.current = false;
		}
	};

	useFrame(({ camera }) => {
		if (rb.current) {
			const vel = rb.current.linvel();
			const pos = rb.current.translation();

			const forward = new THREE.Vector3(0, 0, 0.02).applyQuaternion(
				character.current.quaternion
			);
			const leftward = new THREE.Vector3(0.01, 0, 0).applyQuaternion(
				character.current.quaternion
			);
			const rightward = new THREE.Vector3(-0.01, 0, 0).applyQuaternion(
				character.current.quaternion
			);
			const backward = new THREE.Vector3(0, 0, -0.01).applyQuaternion(
				character.current.quaternion
			);
			const horizontalSpeed = new THREE.Vector2(vel.x, vel.z).length();

			const forwardMovement =
				get().forward || (leftMousePressed && rightMousePressed);

			if (forwardMovement && horizontalSpeed < MAX_SPEED) {
				const impulse = new THREE.Vector3(
					forward.x,
					0,
					forward.z
				).multiplyScalar(WALK_SPEED);
				rb.current.applyImpulse(impulse, true);
				setAnimation("walk");
			}
			if (get().left && horizontalSpeed < MAX_SPEED) {
				const impulse = new THREE.Vector3(
					leftward.x,
					0,
					leftward.z
				).multiplyScalar(WALK_SPEED);
				rb.current.applyImpulse(impulse, true);
				setAnimation("walk");
			}
			if (get().right && horizontalSpeed < MAX_SPEED) {
				const impulse = new THREE.Vector3(
					rightward.x,
					0,
					rightward.z
				).multiplyScalar(WALK_SPEED);
				rb.current.applyImpulse(impulse, true);
				setAnimation("walk");
			}
			if (get().backward && horizontalSpeed < MAX_SPEED) {
				const impulse = new THREE.Vector3(
					backward.x,
					0,
					backward.z
				).multiplyScalar(WALK_SPEED);
				rb.current.applyImpulse(impulse, true);
				setAnimation("walk");
			}
			if (!forwardMovement && !get().left && !get().right && !get().backward) {
				setAnimation("idle");
			}

			if (get().jump && !jumpPressed.current) {
				jump();
				jumpPressed.current = true;
			}
			if (!get().jump) {
				jumpPressed.current = false;
			}

			updateCharacterPosition(pos);
		}
	});

	return (
		<RigidBody colliders={false} lockRotations ref={rb}>
			<group ref={character} rotation={[0, characterRotation, 0]}>
				<Character scale={0.18} position-y={-0.25} animation={animation} />
			</group>
			<CapsuleCollider args={[0.08, 0.15]} />
		</RigidBody>
	);
}
