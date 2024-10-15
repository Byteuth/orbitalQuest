import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import Interface from "./Interface.jsx";


const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
	<>
		<Canvas
			shadows
			onContextMenu={(e) => e.preventDefault()}
			camera={{
				fov: 45,
				near: 0.1,
				far: 1000,
				position: [-10, 40, 10],
			}}
			
		>
			<Experience />
		</Canvas>
		{/* <Interface /> */}
	</>
);
