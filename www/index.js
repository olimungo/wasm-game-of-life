import { Ui } from './src/ui';
import { EngineGenerationType } from './src/inputs';
import { ColonySamples } from './src/colony-samples';
import { UniverseJs } from './src/game-of-life-javascript';
import { UniverseWasm } from './src/game-of-life-wasm';

let universe;

let generationsCount;
let totalTicksDuration;
let totalRedrawDuration;
let startedGenerationTime;
let generationsOver;
let generationPaused;
let animationId = null;
let animationTimeOutId = null;

const ui = Ui(play, pause, reset, drawCell, libraryItemSelected);

const colonySample = ui.getColonySample();

ui.setCanvasDimensions(
    colonySample.width,
    colonySample.height,
    colonySample.cellSize
);

createUniverse();

function createUniverse() {
    clearTimeout(animationTimeOutId);
    cancelAnimationFrame(animationId);

    generationsCount = 0;
    totalTicksDuration = 0;
    totalRedrawDuration = 0;
    generationsOver = false;

    ui.updateUi(0);
    ui.resetResults();

    if (universe) {
        universe.dispose();
    }

    const colonySample = ui.getColonySample();

    universe = createUniverseFactory(
        colonySample.width,
        colonySample.height,
        colonySample.cellSize
    );

    switch (colonySample.id) {
        case ColonySamples.Pattern:
            universe.generatePatternColony();
            break;
        case ColonySamples.Randomly:
            universe.generateRandomColony();
            break;
        default:
            for (let cells of colonySample.cells) {
                universe.setCell(cells[0], cells[1]);
            }
    }

    setTimeout(() => {
        universe.drawAllCells();
    }, 0);
}

function createUniverseFactory(width, height, cellSize) {
    if (ui.getEngineGenerationType() === EngineGenerationType.Wasm) {
        return UniverseWasm().create(width, height, cellSize);
    } else {
        return UniverseJs().create(width, height, cellSize);
    }
}

function renderLoop() {
    const generationsAtOnce = ui.getGenerationsAtOnce();
    let now = new Date().getTime();

    universe.tick(generationsAtOnce);

    totalTicksDuration += new Date().getTime() - now;
    generationsCount += generationsAtOnce;

    ui.updateUi(generationsCount);

    now = new Date().getTime();

    if (generationsAtOnce > 1) {
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
    ui.setPlayButton();
}

function drawCell(row, column) {
    universe.drawCell(row, column);
}

function libraryItemSelected(item) {
    ui.setCanvasDimensions(item.width, item.height, item.cellSize);
    reset();
}
