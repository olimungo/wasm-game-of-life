import { Ui, ColonyGenerationType, EngineGenerationType } from './ui';
import { UniverseJs } from './game-of-life-javascript';
import { UniverseWasm } from './game-of-life-wasm';
import { Fps } from './fps';

let universe;

let generationsCount;
let totalTicksDuration;
let startedGenerationTime;
let generationsOver = false;
let generationPaused = false;
let animationId = null;
let animationTimeOutId = null;

const ui = Ui(play, pause, reset);
const fps = Fps();

createUniverse();

universe.test();

//
// Functions
//

function createUniverse() {
    clearTimeout(animationTimeOutId);
    cancelAnimationFrame(animationId);

    generationsCount = 0;
    totalTicksDuration = 0;
    generationsOver = false;
    generationPaused = false;

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

    universe.drawAllCells();
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
    const beforeTicks = new Date().getTime();

    fps.render();

    universe.tick(ui.getTicksAtOnce());

    totalTicksDuration += new Date().getTime() - beforeTicks;
    generationsCount += ui.getTicksAtOnce();

    ui.setUiCounter(generationsCount);

    if (ui.getTicksAtOnce() > 1) {
        universe.drawAllCells();
    } else {
        universe.drawUpdatedCells();
    }

    if (generationsCount < ui.getNumberOfGenerations()) {
        if (ui.getThrottle() > 0) {
            animationTimeOutId = setTimeout(() => {
                animationId = requestAnimationFrame(renderLoop);
            }, ui.getThrottle());
        } else {
            animationId = requestAnimationFrame(renderLoop);
        }
    } else {
        generationsOver = true;

        ui.setPlayButton();

        if (!generationPaused) {
            const now = new Date().getTime();
            const totalDuration = now - startedGenerationTime;
            const averageTickDuration = totalTicksDuration / generationsCount;
            const totalRedrawDuration =
                now - startedGenerationTime - totalTicksDuration;
            const averageRedrawDuration =
                (now - startedGenerationTime - totalTicksDuration) /
                generationsCount;

            ui.setResults({
                totalDuration,
                totalTicksDuration,
                averageTickDuration,
                totalRedrawDuration,
                averageRedrawDuration,
            });
        }
    }
}

function play() {
    if (generationsOver) {
        generationsOver = false;

        createUniverse();
    }

    startedGenerationTime = new Date().getTime();

    renderLoop();
}

function pause() {
    cancelAnimationFrame(animationId);
    clearTimeout(animationTimeOutId);

    generationPaused = true;
}

function reset() {
    createUniverse();
}
