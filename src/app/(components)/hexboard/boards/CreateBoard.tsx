import ArraySelect from "@/app/(components)/hexboard/forms/ArraySelect";
import GameBoard from "../HexBoardSVG";
import { useState } from "react";
import { gameGlobals, hexagon } from "../hexDefinitions";
import SaveRosterButton from "@/app/(components)/hexboard/forms/saveRoster";
import { calcCenteredRectangle, cube_ring, hexOrientations } from "../hexMath";
import CanvasControl from "@/app/(components)/hexboard/forms/CanvasControl";
import BoardControl from "@/app/(components)/hexboard/forms/BoardControl";
import aspectRatio from "../rectMath";
import { clickMessage } from "../hexFunctions";
import { styles } from "../../helpersUniversal/tsStyles";

export default function CreateBoard() {
	// <> States that control canvas parameters
	const [hexRadius, SEThexRadius] = useState(200);
	const [separationMultiplier, SETseparationMultiplier] = useState(1.1)
	const [defaultOrientation, SETdefaultOrientation] = useState(hexOrientations["flat-top"])

	// States unique to this board
	const [qTemp, SETqTemp] = useState(0);
	const [rTemp, SETrTemp] = useState(0);
	const cssClassChoices = [
		`just-grid`,
		`bg-white`,
		'bg-red',
		'bg-orange',
		'bg-yellow',
		'bg-green',
		'bg-blue',
		'bg-purple',
	]
	const [classTemp, SETclassTemp] = useState(cssClassChoices[0])
	// const blankRoster: hexagon[] = []
	const centerHex: hexagon = { q: 0, r: 0, cssClasses: cssClassChoices[0] }
	let tempRoster: hexagon[] = [centerHex]
	const boardSize: number = 7
	for (let i = 1; i < boardSize; i++) {
		const thisRing = cube_ring(centerHex, i)
		// console.log(`Ring ${i} is ${JSON.stringify(thisRing)}`)
		tempRoster = tempRoster.concat(thisRing);
		// console.log(JSON.stringify(tempRoster))
	}
	tempRoster = tempRoster.map((eachHex) => { eachHex.cssClasses = cssClassChoices[0] + " hover-space"; return eachHex; })
	const [hexRoster, SEThexRoster] = useState<hexagon[]>(tempRoster)

	function addHex() {
		let tempRoster = Array.from(hexRoster)
		tempRoster.push({ q: qTemp, r: rTemp, cssClasses: classTemp })
		SEThexRoster(tempRoster);
	}

	let form = <div className="form-group border bg-orange p-3">
		<h3 className={styles.h3}>Add Hex</h3>
		<div id="setQdiv">
			<label className="" htmlFor="qField">q:</label>
			<input className="form-control" name="qField" defaultValue={qTemp} onChange={(e) => SETqTemp(+e.target.value)} />
		</div>
		<div className="setRdiv">
			<label className="" htmlFor="rField">r:</label>
			<input className="form-control" name="rField" defaultValue={rTemp} onChange={(e) => SETrTemp(+e.target.value)} />
		</div>
		<div id="chooseClass">
			<ArraySelect
				choicesArray={cssClassChoices}
				onChange={SETclassTemp}
			/>
		</div>
		<div id="buttons">
			<button className="btn form-control bg-orange" onClick={() => addHex()}>Add</button>
		</div>
	</div>

	const gameGlobals: gameGlobals = {
		orientation: defaultOrientation,
		hexRadius: hexRadius,
		separationMultiplier: separationMultiplier,
		textSize: 12,
		drawBackBoard: false,
		onClick: clickMessage
	}

	// <><><> Calculate the size of the canvas based on the hex roster
	const canvasDefaults = calcCenteredRectangle(hexRoster, gameGlobals)
	const [canvasHeight, SETcanvasHeight] = useState(canvasDefaults.canvasHeight * separationMultiplier)
	const [canvasWidth, SETcanvasWidth] = useState(canvasHeight * aspectRatio())
	// Since this is a centered board, we can calculate the origin based on the height and width
	const [hexGridOrigin, SEThexGridOrigin] = useState({ x: canvasWidth / 2, y: canvasHeight / 2 });

	const canvasGlobals = {
		canvasWidth, canvasHeight, hexGridOrigin,
		canvasBackgroundColor: '#000'
	}

	return (
		<div className={styles.gridContainer} id="generativeContainer">
			<div id="sidebar" className={styles.gridSidebar}>
				<SaveRosterButton
					hexRoster={hexRoster}
					gameGlobals={gameGlobals}
				/>
				{form}
				<BoardControl
					hexRadius={hexRadius}
					separationMultiplier={separationMultiplier}
					SEThexRadius={SEThexRadius}
					SETseparationMultiplier={SETseparationMultiplier} />
				<CanvasControl
					canvasWidth={canvasWidth} SETcanvasWidth={SETcanvasWidth}
					canvasHeight={canvasHeight} SETcanvasHeight={SETcanvasHeight}
					hexGridOrigin={hexGridOrigin} SEThexGridOrigin={SEThexGridOrigin}
				/>
			</div>
			<div id='createBoard' className={styles.gridContainer}>
				<GameBoard
					hexRoster={hexRoster}
					gameGlobals={gameGlobals}
					canvasGlobals={canvasGlobals}
				/>
			</div>
		</div>
	)
}