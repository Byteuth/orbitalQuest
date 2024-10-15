import { RigidBody } from "@react-three/rapier";
import { useState, useEffect, useMemo } from "react";
import { useControls } from "leva";
import { Billboard, Text } from "@react-three/drei";

import { getSpellDamage } from "./spellsDb.js";

export default function Enemies() {
	const { mobCount } = useControls({
		mobCount: {
			value: 10,
			min: 0,
			max: 100,
			step: 1,
		},
	});
	const radius = 9.5;
	const angle = Math.random() * Math.PI * 2;
	const [enemyHealth, setEnemyHealth] = useState(Array(mobCount).fill(100));

	const enemyPositions = useMemo(() => {
		return new Array(mobCount).fill(null).map((_, i) => {
			const x = Math.cos(angle * i * 0.25) * radius;
			const z = Math.sin(angle * i * 0.25) * radius;
			return [x, 0.5, z];
		});
	}, [mobCount]);

	useEffect(() => {
		setEnemyHealth(Array(mobCount).fill(100));
	}, [mobCount]);

	const handleCollision = (index, e) => {
		const spellId = e.rigidBody?.userData.spellId;
		const damageTaken = getSpellDamage(spellId);
	
		setEnemyHealth((prev) =>
			prev.map((health, i) =>
				i === index ? Math.max(health - damageTaken, 0) : health
			)
		);
	};

	return (
		<>
			{enemyHealth.map((health, i) => {
				return (
					<group key={i}>
						<RigidBody
							type="dynamic"
							position={enemyPositions[i]}
							linearDamping={health < 10 ? 0.3: 10}
							angularDamping={health < 10 ? 0.3: 10}
							mass={100}
							lockRotations={health < 20 ? false : true}
							onCollisionEnter={(e) => handleCollision(i, e)}
						>
							<mesh userData={{ isTargetable: true, mobHealth: health }}>
								<capsuleGeometry args={[0.3, 0.7, 32]} />
								<meshStandardMaterial color="red" />
							</mesh>
							<Billboard scale={0.5} position-y={1}>
								<Text color={health > 20 ? "green" : "red"}>{health}</Text>
							</Billboard>
						</RigidBody>
					</group>
				);
			})}
		</>
	);
}
