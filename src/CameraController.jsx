import { useRef, useEffect, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStore from "./Stores/useGame";
import * as THREE from "three";

export default function CameraController() {
	const characterPosition = useStore((state) => state.characterPosition);
	const updateCharacterRotation = useStore(
		(state) => state.updateCharacterRotation
	);
	const { camera } = useThree();
	const controlsRef = useRef();

	const minDistance = 1;
	const maxDistance = 10;

	const [rightMouseDown, setRightMouseDown] = useState(false);
	const targetVector = useRef(new THREE.Vector3());

	const handleMouseDown = (event) => {
		if (event.button === 2) setRightMouseDown(true);
	};

	const handleMouseUp = (event) => {
		if (event.button === 2) setRightMouseDown(false);
	};

	useEffect(() => {
		window.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	useFrame(() => {
		if (controlsRef.current && characterPosition) {
			targetVector.current.lerp(
				new THREE.Vector3(
					characterPosition.x,
					characterPosition.y + 1,
					characterPosition.z
				),
				0.1
			);

			controlsRef.current.target.copy(targetVector.current);
			controlsRef.current.update();

			if (rightMouseDown) {
				const cameraDirection = new THREE.Vector3();
				camera.getWorldDirection(cameraDirection);

				const angle = Math.atan2(cameraDirection.x, cameraDirection.z);
				updateCharacterRotation(angle);
			}
		}
	});

	return (
		<OrbitControls
			ref={controlsRef}
			enablePan={false}
			maxDistance={maxDistance}
			minDistance={minDistance}
			enableZoom={true}
			enableRotate={true}
			mouseButtons={{
				LEFT: THREE.MOUSE.ROTATE, 
				RIGHT: THREE.MOUSE.ROTATE, 
			}}
		/>
	);
}
