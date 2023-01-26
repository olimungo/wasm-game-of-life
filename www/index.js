import { Ui, ColonyGenerationType, EngineGenerationType } from './src/ui';
import { UniverseJs } from './src/game-of-life-javascript';
import { UniverseWasm } from './src/game-of-life-wasm';
import { Fps } from './src/fps';

let universe;

let generationsCount;
let totalTicksDuration;
let totalRedrawDuration;
let startedGenerationTime;
let generationsOver;
let generationPaused;
let animationId = null;
let animationTimeOutId = null;

const ui = Ui(play, pause, reset);
const fps = Fps();

createUniverse();

//
// Functions
//

function createUniverse() {
    clearTimeout(animationTimeOutId);
    cancelAnimationFrame(animationId);

    generationsCount = 0;
    totalTicksDuration = 0;
    totalRedrawDuration = 0;
    generationsOver = false;

    ui.setUiCounter(0);
    ui.resetResults();

    if (universe) {
        universe.dispose();
    }

    universe = createUniverseFactory();

    const isGenerationTypeRandomly =
        ui.getColonyGenerationType() === ColonyGenerationType.Randomly
            ? true
            : false;

    if (isGenerationTypeRandomly) {
        universe.generateRandomColony();
    } else {
        universe.generatePatternColony();
    }

    setTimeout(() => {
        universe.drawAllCells();
    }, 0);
}

function createUniverseFactory() {
    const width = ui.getWidth();
    const height = ui.getHeight();
    const cellSize = ui.getCellSize();

    if (ui.getEngineGenerationType() === EngineGenerationType.Wasm) {
        return UniverseWasm().create(width, height, cellSize);
    } else {
        return UniverseJs().create(width, height, cellSize);
    }
}

function renderLoop() {
    fps.render();

    let now = new Date().getTime();

    universe.tick(ui.getTicksAtOnce());

    totalTicksDuration += new Date().getTime() - now;
    generationsCount += ui.getTicksAtOnce();

    ui.setUiCounter(generationsCount);

    now = new Date().getTime();

    if (ui.getTicksAtOnce() > 1) {
        universe.drawAllCells();
    } else {
        universe.drawUpdatedCells();
    }

    totalRedrawDuration += new Date().getTime() - now;

    now = new Date().getTime();
    const totalDuration = now - startedGenerationTime;
    const averageTickDuration = totalTicksDuration / generationsCount;
    const averageRedrawDuration = totalRedrawDuration / generationsCount;

    ui.setResults({
        totalDuration,
        totalTicksDuration,
        averageTickDuration,
        totalRedrawDuration,
        averageRedrawDuration,
    });

    if (generationsCount < ui.getNumberOfGenerations()) {
        // Always use a setTimeout, even with a value of 0, so to
        // let the browser engine have some time to redraw the screen
        // or do other stuffs
        animationTimeOutId = setTimeout(() => {
            animationId = requestAnimationFrame(renderLoop);
        }, ui.getThrottle());
    } else {
        generationsOver = true;

        ui.openResults();
        ui.setPlayButton();
    }
}

function play() {
    if (generationPaused) {
        startedGenerationTime += new Date().getTime() - generationPaused;
    } else {
        if (generationsOver) {
            generationsOver = false;
            createUniverse();
        }

        startedGenerationTime = new Date().getTime();
    }

    generationPaused = 0;

    renderLoop();
}

function pause() {
    cancelAnimationFrame(animationId);
    clearTimeout(animationTimeOutId);

    generationPaused = new Date().getTime();
}

function reset() {
    createUniverse();
}
