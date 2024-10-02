import { Perf } from "r3f-perf";
import { useControls } from "leva";
import { useState } from "react";

export default function Performance() {
	const [perfVisible, setPerfVisible] = useState(true);

	useControls("Performance",{
		PerfVisibility: {
			value: perfVisible,
			onChange: (v) => setPerfVisible(v),
		},
	});

	return perfVisible ? <Perf position="top-left" /> : null;
}
