import { useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function CastSpell({
	actionKeyName,
	character,
	targetLocation,
	handleAddSphere
}) {
	const spellId = actionKeyName[actionKeyName.length - 1];
	const spellColors = {
		1: "red",
		2: "yellow",
		3: "green",
		4: "blue",
	};

	const sphereRadius = 0.5;
	const sphereMass = 5;
	const sphereColor = spellColors[spellId];

	const createSphere = (startLocation, direction) => {
		const sphereMesh = (
			<RigidBody
				key={Math.random()}
				position={startLocation}
				linearVelocity={direction.multiplyScalar(50)}
				type="dynamic"
				colliders="ball"
				mass={sphereMass}
				linearDamping={0.1}
				angularDamping={0.1}
			>
				<mesh>
					<sphereGeometry args={[sphereRadius, 16, 16]} />
					<meshStandardMaterial color={sphereColor} />
				</mesh>
			</RigidBody>
		);
		handleAddSphere(sphereMesh);
	};

	const handleCastSpell = () => {
		const spellStartLocation = new THREE.Vector3();
		spellStartLocation.setFromMatrixPosition(character.matrixWorld);
		spellStartLocation.y += 1.5;

		const spellEndLocation = new THREE.Vector3(
			targetLocation.x,
			1,
			targetLocation.z
		);

		const direction = new THREE.Vector3();
		direction.subVectors(spellEndLocation, spellStartLocation).normalize();

		createSphere(spellStartLocation, direction);
	};

	useEffect(() => {
		handleCastSpell();
        console.log('spell')
	}, [character, targetLocation]);

	return null;
}
