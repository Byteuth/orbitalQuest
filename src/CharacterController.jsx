import Ecctrl from "ecctrl";
import { KeyboardControls } from "@react-three/drei";
import useGame from "./Stores/useGame";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import CastSpell from "./Components/CastSpell";

export default function CharacterController() {
	const keyboardMap = [
		{ name: "forward", keys: ["ArrowUp", "KeyW"] },
		{ name: "backward", keys: ["ArrowDown", "KeyS"] },
		{ name: "leftward", keys: ["ArrowLeft", "KeyA"] },
		{ name: "rightward", keys: ["ArrowRight", "KeyD"] },
		{ name: "jump", keys: ["Space"] },
		{ name: "run", keys: ["Shift"] },
		{ name: "action1", keys: ["Digit1"] },
		{ name: "action2", keys: ["Digit2"] },
		{ name: "action3", keys: ["Digit3"] },
		{ name: "action4", keys: ["Digit4"] },
		{ name: "action5", keys: ["KeyF"] },
	];

	const setKey = useGame((state) => state.setKey);
	const spellDetails = useGame((state) => state.spellDetails);
	const setSpellDetails = useGame((state) => state.setSpellDetails);
	const characterRef = useRef();
	const raycaster = new THREE.Raycaster();
	const mouse = useRef(new THREE.Vector2());
	const { camera, scene } = useThree();
	const [spheres, setSpheres] = useState([]);

	const handleAddSphere = (sphereMesh) => {
		setSpheres((prev) => [...prev, sphereMesh]);
	};

	useEffect(() => {
		const handleKeyDown = (e) => {
			keyboardMap.forEach((action) => {
				if (action.keys.includes(e.code)) {
					setKey(action.name, true);
					if (
						["action1", "action2", "action3", "action4"].includes(action.name)
					) {
						raycaster.setFromCamera(mouse.current, camera);
						const intersects = raycaster.intersectObjects(scene.children, true);
						if (intersects.length > 0) {
							const target = intersects[0].object;
							if (target.userData && target.userData.isTargetable) {
								const newSpellDetails = {
									actionKeyName: action.name,
									character: characterRef.current,
									targetLocation: intersects[0].point,
								};
								setSpellDetails(newSpellDetails);
							}
						}
					}
				}
			});
		};

		const handleMouseMove = (e) => {
			mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
			mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [setKey, keyboardMap, camera, scene, setSpellDetails]);

	return (
		<>
			<KeyboardControls map={keyboardMap}>
				<Ecctrl
					animated
					camMoveSpeed={1.5}
					camInitDis={-25}
					camLowLimit={0}
					camMaxDis={-50}
					camZoomSpeed={5}
					floatHeight={0.1}
					disableFollowCam={false}
					disableFollowCamPos={[0, 0, -10]}
				>
					<mesh ref={characterRef}>
						<capsuleGeometry args={[0.3, 0.7, 5]} />
						<meshStandardMaterial color="green" />
					</mesh>
				</Ecctrl>
			</KeyboardControls>
			{spellDetails && (
				<CastSpell
					actionKeyName={spellDetails.actionKeyName}
					character={spellDetails.character}
					targetLocation={spellDetails.targetLocation}
					handleAddSphere={handleAddSphere}
				/>
			)}
			{spheres.map((sphere) => sphere)}
		</>
	);
}
