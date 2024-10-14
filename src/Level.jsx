import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
import { useGLTF, Float, Text, Grid } from "@react-three/drei";

import { useControls } from "leva";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({
	color: "#383839",
});

export function Ground({ size }) {
	return (
		<RigidBody type="fixed">
			<mesh
				geometry={boxGeometry}
				material={floor1Material}
				position={[0, 0, 0]}
				scale={[size, 0.6, size]}
				receiveShadow
			/>
		</RigidBody>
	);
}
export function CinderBlocks({ position }) {
	const { nodes, materials, scene } = useGLTF("./models/singleblock.glb");
	const clonedScene = useMemo(() => {
		const clone = scene.clone();
		clone.traverse((child) => {
			if (child.isMesh) {
				child.userData = { isTargetable: true }; 
			}
		});
		return clone;
	}, [scene]);

	return (
		<RigidBody
			type="dynamic"
			position={position}
			linearDamping={0.5}
			angularDamping={0.5}
			mass={10}
		>
			<primitive object={clonedScene} position={[0, 0, 0]} />
		</RigidBody>
	);
}

export default function Level({}) {
	const size = 20;
	const blockCount = 4;

	const { gridEnabled } = useControls("Grid", {
		gridEnabled: true,
	});

	return (
		<>
			<Ground size={size} />
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={i} position={[4, i * 1, 0]} />
			))}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={i} position={[4, i * 1, 2]} />
			))}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={i} position={[4, i * 1, -2]} />
			))}

			{gridEnabled && (
				<Grid
					position={[0, 0.31, 0]}
					args={[size, size]}
					cellSize={0.1}
					cellColor={new THREE.Color("#454546")}
					sectionColor={new THREE.Color("#777779")}
				/>
			)}
		</>
	);
}
