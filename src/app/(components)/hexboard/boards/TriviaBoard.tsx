import GameBoard from '../HexBoardSVG';
import ErrorBoundary from '@/app/(components)/helpersUniversal/ErrorBoundary';
import { useState } from "react";
import { gameGlobals, hexagon } from '../hexDefinitions';
import { blackHexes, clickMessage, colorHexes } from '../hexFunctions';
import { hexOrientations, cube_ring, calcCenteredRectangle } from '../hexMath'
import CanvasControl from '../forms/CanvasControl';
import BoardControl from '../forms/BoardControl';
import aspectRatio from '../rectMath';
import { styles } from '../../helpersUniversal/tsStyles';
import RosterDisplay from '../RosterDisplay';

export default function TriviaBoard() {
  // Constants, States, and Functions unique to this board
  const cssClasses = ["bg-green", "bg-red", "bg-blue", "bg-yellow", "bg-purple", "bg-orange"]
  let cssClassIndex = 0;
  function getNextCssClass() {
    let cssClass = cssClasses[cssClassIndex];
    cssClassIndex = (cssClassIndex + 1) % cssClasses.length;
    return cssClass;
  }

  // <> States that control canvas parameters
  const [hexRadius, SEThexRadius] = useState(200);
  const [separationMultiplier, SETseparationMultiplier] = useState(1.1)

  // <><><> Step 1: Create the hex roster
  // Create a center hexagon
  const centerHexagon = { "key": 0, "q": 0, "r": 0, "cssClasses": "gameboard-center bg-gray" }
  let hexRoster: hexagon[] = [centerHexagon]

  // First ring
  let ring1: hexagon[] = cube_ring({ "q": 0, "r": 0 }, 1);
  blackHexes(ring1);

  //Second ring
  let ring2: hexagon[] = cube_ring({ "q": 0, "r": 0 }, 2)
  colorHexes(ring2, getNextCssClass);

  // Third ring
  let ring3: hexagon[] = cube_ring({ "q": 0, "r": 0 }, 3)
  blackHexes(ring3);

  // Fourth ring
  let ring4: hexagon[] = cube_ring({ "q": 0, "r": 0 }, 4)
  colorHexes(ring4, getNextCssClass);

  // Gather the different rings together
  hexRoster = hexRoster.concat(ring1);
  hexRoster = hexRoster.concat(ring2);
  hexRoster = hexRoster.concat(ring3);
  hexRoster = hexRoster.concat(ring4);

  // <><><> The game globals needed for rendering
  const gameGlobals: gameGlobals = {
    // Hexagons
    orientation: hexOrientations['flat-top'],
    hexRadius: hexRadius,
    separationMultiplier: separationMultiplier,
    textSize: 12,
    drawBackBoard: true,
    onClick: clickMessage,
  }

  // <><><> Calculate the size of the canvas based on the hex roster
  const canvasDefaults = calcCenteredRectangle(hexRoster, gameGlobals)
  const [canvasHeight, SETcanvasHeight] = useState(canvasDefaults.canvasHeight * separationMultiplier)
  const [canvasWidth, SETcanvasWidth] = useState(canvasHeight * aspectRatio())
  // Since this is a centered board, we can calculate the origin based on the height and width
  const [hexGridOrigin, SEThexGridOrigin] = useState({ x: canvasWidth / 2, y: canvasHeight / 2 })
  const canvasGlobals = {
    canvasWidth: canvasWidth, canvasHeight: canvasHeight, hexGridOrigin: hexGridOrigin,
    canvasBackgroundColor: '#000',
  }

  return (

    <div id="triviaBoardContainer" className={styles.gridContainer}>
      <div id="sideBar" className="">
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
      <div id='displayBoard' className={styles.gridDisplay}>
        <ErrorBoundary>
          <GameBoard
            gameGlobals={gameGlobals}
            canvasGlobals={canvasGlobals}
            hexRoster={hexRoster}
            displayRoster={true}
          //   logo={logo}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}