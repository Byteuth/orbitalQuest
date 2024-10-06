import { useKeyboardControls } from "@react-three/drei";
import useGame from "./Stores/useGame.js";
import { useRef, useEffect } from "react";
import { addEffect } from "@react-three/fiber";

export default function Interface() {
	const time = useRef();
	const phase = useGame((state) => state.phase);
	const restart = useGame((state) => state.restart);
	const forward = useKeyboardControls((state) => state.forward);
	const backward = useKeyboardControls((state) => state.backward);
	const leftward = useKeyboardControls((state) => state.leftward);
	const rightward = useKeyboardControls((state) => state.rightward);
	const jump = useKeyboardControls((state) => state.jump);

	useEffect(() => {
		const unsubscribeEffect = addEffect(() => {
			const state = useGame.getState();

			let timeElapsed = 0;

			if (state.phase === "playing") {
				timeElapsed = Date.now() - state.startTime;
			} else if (state.phase === "ended") {
				timeElapsed = state.endTime - state.startTime;
			}

			timeElapsed /= 1000;
			timeElapsed = timeElapsed.toFixed(2);
			if (time.current) time.current.textContent = timeElapsed;
		});

		return () => {
			unsubscribeEffect();
		};
	}, []);

	return (
		<div className="interface">
			{/* <div ref={time} className="time"></div> */}
			{phase === "ended" ? (
				<div className="restart" onClick={restart}>
					Restart
				</div>
			) : null}
			<div className="controls">
				<div className="raw">
					<div className={`key ${forward ? "active" : ""}`}></div>
				</div>
				<div className="raw">
					<div className={`key ${leftward ? "active" : ""}`}></div>
					<div className={`key ${backward ? "active" : ""}`}></div>
					<div className={`key ${rightward ? "active" : ""}`}></div>
				</div>
				<div className="raw">
					<div className={`key large ${jump ? "active" : ""}`}></div>
				</div>
			</div>
		</div>
	);
}
