import ErrorBoundary from "@/app/(components)/helpers/ErrorBoundary";
import GameBoard from "../HexBoardSVG";
import { useState } from "react";

import { gameGlobals, hexagon, vector } from "../hexDefinitions";
import { alreadyThere, clickMessage, randomMove } from "../hexFunctions";
import SaveRosterButton from "@/app/(components)/hexboard/forms/saveRoster";

import CanvasControl from "../forms/CanvasControl";
import { calcCenteredRectangle, hexOrientations } from "../hexMath";
import BoardControl from "@/app/(components)/hexboard/forms/BoardControl";
import aspectRatio from "../rectMath";
import { styles } from "../../helpers/tsStyles";

export default function GenerativeBoard(props: any) {
	// <> States that control canvas parameters
	const [hexRadius, SEThexRadius] = useState(200);
	const [separationMultiplier, SETseparationMultiplier] = useState(1.1)
	const [defaultOrientation, SETdefaultOrientation] = useState(hexOrientations["flat-top"])

	const [numberOfSpaces, SETnumberOfSpaces] = useState(50);
	const [tempNumber, SETtempNumber] = useState(numberOfSpaces)
	const [hexRoster, SEThexRoster] = useState(newRoster())

	// Randomize color assignment so that 1/3 hexes are green
	function mapColor(): string {
		const rando = randomInt(25)
		if (rando === 1) return "bg-green"
		// if (rando === 2) return "bg-red"
		else return "bg-blue"
	}

	function randomInt(int: number): number {
		return Math.floor(int * Math.random())
	}

	function colorHexes(hexes: hexagon[]) {
		hexes.forEach(hex => { if (hex.cssClasses === undefined) hex.cssClasses = `hover-space ${mapColor()}` })
	}

	function newRoster(): hexagon[] {
		let tempHexList: hexagon[] = []
		let q = 0;
		let r = 0;
		tempHexList.push({ q: 0, r: 0, cssClasses: "hover-space bg-white" })
		for (let i = 0; i < numberOfSpaces; i++) {
			let found = false;
			let nextMove: vector = randomMove()
			// Prevent overlap
			while (!found) {
				q += nextMove.q;
				r += nextMove.r;
				found = !alreadyThere({ q, r }, tempHexList)
			}
			tempHexList.push({ q, r })
		}
		// Give the hexes some color
		colorHexes(tempHexList);
		return tempHexList;
	}

	// Interface for changing things

	const editForm =
		<div id="reRender" className={styles.hexBoardForm}>
			<h3 className={styles.h3}>Generation Parameters</h3>
			<label htmlFor="pickSpace">Number of cells: </label>
			<input type="number" className={styles.fields} defaultValue={tempNumber} onChange={(e) => { SETtempNumber(+e.target.value); SETnumberOfSpaces(tempNumber); SEThexRoster(newRoster()); }} />
			{/* <button className={`btn bg-blue`} onClick={() => {
				SETnumberOfSpaces(tempNumber);
				SEThexRoster(newRoster());
			}
			}>Re-shuffle</button > */}
		</div>

	const gameGlobals: gameGlobals = {
		orientation: defaultOrientation,
		hexRadius: hexRadius,
		separationMultiplier: separationMultiplier,
		textSize: 12,
		drawBackBoard: false,
		onClick: clickMessage,
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
				{editForm}
				<SaveRosterButton
					hexRoster={hexRoster}
					gameGlobals={gameGlobals}
				/>
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

				{/* <RosterDisplay hexRoster={hexRoster} /> */}
			</div>
			<div id='generativeBoard' className={styles.gridDisplay}>
				<ErrorBoundary>
					<GameBoard
						hexRoster={hexRoster}
						gameGlobals={gameGlobals}
						canvasGlobals={canvasGlobals}
					// textSize={props.textSize}
					//   logo={logo}
					/>
				</ErrorBoundary>
			</div>
		</div>
	);
}