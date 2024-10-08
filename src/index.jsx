import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import Experience from "./Experience.jsx";
import Interface from "./Interface.jsx";

const keyboardMap = [
	{ name: "forward", keys: ["ArrowUp", "KeyW"] },
	{ name: "backward", keys: ["ArrowDown", "KeyS"] },
	{ name: "left", keys: ["ArrowLeft", "KeyA"] },
	{ name: "right", keys: ["ArrowRight", "KeyD"] },
	{ name: "jump", keys: ["Space"] },
];
const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
	<KeyboardControls map={keyboardMap}>
		<Canvas
			shadows
			camera={{
				fov: 45,
				near: 0.1,
				far: 200,
				position: [-1, 3, 0],
			}}
		>
			<Experience />
		</Canvas>
		<Interface />
	</KeyboardControls>
);
