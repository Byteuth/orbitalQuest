import { useEffect, useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function CastSpell({
	actionKeyName,
	character,
	targetLocation,
	handleAddSphere,
	handleRemoveSphere,
}) {
	const spellId = actionKeyName[actionKeyName.length - 1];
	const sphereColors = {
		1: "red",
		2: "green",
		3: "blue",
		4: "yellow",
	};
	const sphereDimensions = {
		1: 0.3,
		2: 0.5,
		3: 0.7,
		4: 0.8,
	};
	const impulse = {
		1: 30,
		2: 40,
		3: 50,
		4: 10,
	};

	const sphereMasses = {
		1: 0.5,
		2: 0.5,
		3: 1,
		4: 1,
	
	}
	const sphereRadius = sphereDimensions[spellId];
	const sphereMass = sphereMasses[spellId];
	const sphereColor = sphereColors[spellId];
	const sphereCount = useRef(0);

	const createSphere = (startLocation, direction) => {
		const uniqueKey = `sphere_${sphereCount.current}`;
		const sphereMesh = (
			<RigidBody
				key={uniqueKey}
				position={startLocation}
				linearVelocity={direction.multiplyScalar(impulse[spellId])}
				type="dynamic"
				colliders="ball"
				mass={sphereMass}
				linearDamping={0.1}
				angularDamping={0.1}
				userData={{ spellId: spellId }}
				onCollisionExit={(e) => handleRemoveSphere(uniqueKey, e)}
			>
				<mesh>
					<sphereGeometry args={[sphereRadius, 16, 16]} />
					<meshStandardMaterial color={sphereColor} />
				</mesh>
			</RigidBody>
		);

		handleAddSphere({ key: uniqueKey, mesh: sphereMesh })
		sphereCount.current += 1;
	};

	const handleCastSpell = () => {
		const spellStartLocation = new THREE.Vector3();
		spellStartLocation.setFromMatrixPosition(character.matrixWorld);
		spellStartLocation.y += 1.5;

		const spellEndLocation = new THREE.Vector3(
			targetLocation.x,
			targetLocation.y,
			targetLocation.z
		);

		const direction = new THREE.Vector3();
		direction.subVectors(spellEndLocation, spellStartLocation).normalize();

		createSphere(spellStartLocation, direction);
	};

		



	useEffect(() => {
		handleCastSpell();
	}, [character, targetLocation]);

	return null;
}
