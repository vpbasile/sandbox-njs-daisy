
import { Dispatch } from "react";
import { coordinateXY } from "../hexDefinitions";
import ValueField from "@/app/(components)/hexboard/forms/ValueField";
import { styles } from "../../helpersUniversal/tsStyles";
// import { useState } from 'react';

type myProps = {
	canvasWidth: number,
	SETcanvasWidth: Dispatch<number>,
	canvasHeight: number,
	SETcanvasHeight: Dispatch<number>,
	hexGridOrigin: coordinateXY
	SEThexGridOrigin: Dispatch<coordinateXY>
}

export default function CanvasControl(props: myProps) {
	const canvasWidth = props.canvasWidth; const canvasHeight = props.canvasHeight;
	// const hexGridOrigin = props.hexGridOrigin;
	// const [gridOriginTempX,SETgridOriginTempX] = useState(hexGridOrigin.x)
	// const [gridOriginTempY,SETgridOriginTempY] = useState(hexGridOrigin.y)
	const SETcanvasWidth = props.SETcanvasWidth;
	const SETcanvasHeight = props.SETcanvasHeight;
	// const SEThexGridOrigin = props.SEThexGridOrigin;

	return (<div id="canvasControlDiv" className={styles.hexBoardForm}>
		<h3 className={styles.h3}>Canvas Parameters</h3>
		<div className="" id="canvasDimensionDiv">
			<ValueField
				fieldName="pickCanvasWidth"
				labelText="Canvas Width"
				type="number"
				defaultValue={canvasWidth}
				onChangeFunction={SETcanvasWidth} />
			<ValueField
				fieldName="pickCanvasHeight"
				labelText="Canvas Height"
				type="number"
				defaultValue={canvasHeight}
				onChangeFunction={SETcanvasHeight} />
		</div>
		{/* <div className="" id="gridOriginDiv">
			<ValueField
			fieldName="pickGridOriginX"
			labelText="Grid Origin x"
			type="number"
			defaultValue={gridOriginTempX}
			onChangeFunction={SETgridOriginTempX} />
			<ValueField
			fieldName="pickGridOriginY"
			labelText="Grid Origin y"
			type="number"
			defaultValue={gridOriginTempY}
			onChangeFunction={SETgridOriginTempY} />
			<button className={`btn bg-blue`} onClick={() => {} >Button</button>
		</div> */}
		{/* Needs the ability to set orientation */}
		{/* <p className="">You'll have to click a selector button above to re-render with the settigns you make on this form.  I'm working on fixing this.</p> */}
	</div>)
}