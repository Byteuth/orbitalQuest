import Ecctrl from "ecctrl";
import { KeyboardControls } from "@react-three/drei";
import useGame from "./Stores/useGame";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import CastSpell from "./Components/CastSpell";
import { Fragment } from "react";

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
	const spellActionPressed = useRef({});
	const [spheres, setSpheres] = useState([]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			keyboardMap.forEach((action) => {
				if (action.keys.includes(e.code)) {
					if (
						action.name.startsWith("action") &&
						!spellActionPressed.current[action.name]
					) {
						spellActionPressed.current[action.name] = true;
						setKey(action.name, true);

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

		const handleKeyUp = (e) => {
			keyboardMap.forEach((action) => {
				if (action.keys.includes(e.code)) {
					if (action.name.startsWith("action")) {
						spellActionPressed.current[action.name] = false;
					}
					setKey(action.name, false);
				}
			});
		};

		const handleMouseMove = (e) => {
			mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
			mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [setKey, keyboardMap, camera, scene, setSpellDetails]);

	const handleAddSphere = (sphereMesh) => {
		setSpheres((prev) => [...prev, sphereMesh]);
	};

	const handleRemoveSphere = (sphereKey, e) => {
		if (e.rigidBodyObject.userData.isCharacter) return;
		setSpheres((prev) => prev.filter((sphere) => sphere.key !== sphereKey));
	};
	return (
		<>
			<KeyboardControls map={keyboardMap}>
				<Ecctrl
					animated
					camMoveSpeed={1.5}
					// camInitDir={[Math.atan2(10, 10), Math.atan2(40, Math.sqrt(10 ** 2 + 10 ** 2))]}
					camCollisionOffset={0.7}
					camInitDis={-Math.sqrt(10 ** 2 + 40 ** 2 + 10 ** 2)}
					camLowLimit={0}
					camMaxDis={-50}
					camZoomSpeed={5}
					floatHeight={0.1}
					disableFollowCam={false}
					disableFollowCamPos={[0, 0, -10]}
					userData={{ isCharacter: true }}
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
					handleRemoveSphere={handleRemoveSphere}
				/>
			)}
			{spheres.map(({ key, mesh }) => (
				<Fragment key={key}>{mesh}</Fragment>
			))}
		</>
	);
}
