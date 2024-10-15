import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
import { useGLTF, Float, Text, Grid } from "@react-three/drei";
import { useControls } from "leva";
import Enemies from "./Components/Enemies.jsx";

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
			linearDamping={0.8}
			angularDamping={0.8}
			mass={10}
		>
			<primitive object={clonedScene} position={[0, 0, 0]} />
		</RigidBody>
	);
}

export default function Level({}) {
	const size = 100;
	const blockCount = 4;

	const { gridEnabled } = useControls("Debug", {
		gridEnabled: false,
	});

	return (
		<>
			<Ground size={size} />
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`row1-${i}`} position={[12, i * 1, 0]} />
			))}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`row2-${i}`} position={[12, i * 1, 14]} />
			))}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`row3-${i}`} position={[12, i * 1, -14]} />
			))}

			{/* Additional cinder blocks around the map with rotations */}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`group1-${i}`} position={[-13, i * 1, 12]} />
			))}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`group2-${i}`} position={[-18, i * 1, 16]} />
			))}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`group3-${i}`} position={[-16, i * 1, -15]} />
			))}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`group4-${i}`} position={[15, i * 1, 13]} />
			))}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`group5-${i}`} position={[17, i * 1, -13]} />
			))}

			{/* More scattered blocks with rotations */}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`scattered1-${i}`} position={[20, i * 1, -14]} />
			))}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`scattered2-${i}`} position={[-14, i * 1, 22]} />
			))}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`scattered3-${i}`} position={[22, i * 1, 18]} />
			))}
			{new Array(blockCount).fill(null).map((_, i) => (
				<CinderBlocks key={`scattered4-${i}`} position={[-18, i * 1, -20]} />
			))}

			{/* Enemies */}
			<Enemies />

			{/* Debug Grid */}
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
