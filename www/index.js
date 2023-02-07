import { Ui } from './src/ui';
import { ColonySamples } from './src/colony-samples';
import { UniverseFactory } from './src/universe-factory';
import { Rle } from './src/rle';

let universe;

let generationsCounter;
let totalTicksDuration;
let totalRedrawDuration;
let startedGenerationTime;
let generationsOver;
let generationPaused;
let animationId = null;
let animationTimeOutId = null;

const ui = Ui(reset, play, pause, drawCell, reset, displayColony, grabColony);
const rle = Rle();

createUniverse();

function createUniverse() {
    clearTimeout(animationTimeOutId);
    cancelAnimationFrame(animationId);

    generationsCounter = 0;
    totalTicksDuration = 0;
    totalRedrawDuration = 0;
    generationsOver = false;

    ui.resetGame();

    if (universe) {
        universe.dispose();
    }

    const properties = ui.getProperties();

    universe = UniverseFactory(
        properties.engine,
        properties.rowCount,
        properties.columnCount,
        properties.cellSize
    );

    switch (properties.colonySampleId) {
        case ColonySamples.Pattern:
            universe.generatePatternColony();
            break;
        case ColonySamples.Randomly:
            universe.generateRandomColony();
            break;
        default:
            const { error, ...colonySample } = rle.transformToArrayOfLiveCells(
                properties.colony
            );

            for (let cell of colonySample.colony) {
                universe.setCell(cell[0], cell[1]);
            }
    }

    setTimeout(() => {
        universe.drawAllCells();
    }, 0);
}

function renderLoop() {
    const properties = ui.getProperties();
    let now = new Date().getTime();

    universe.tick(properties.generationsAtOnce);

    totalTicksDuration += new Date().getTime() - now;
    generationsCounter += properties.generationsAtOnce;

    ui.updateUi(generationsCounter);

    now = new Date().getTime();

    if (properties.generationsAtOnce > 1) {
        universe.drawAllCells();
    } else {
        universe.drawUpdatedCells();
    }

    totalRedrawDuration += new Date().getTime() - now;

    now = new Date().getTime();
    const totalDuration = now - startedGenerationTime;
    const averageTickDuration = totalTicksDuration / generationsCounter;
    const averageRedrawDuration = totalRedrawDuration / generationsCounter;

    ui.setResults({
        totalDuration,
        totalTicksDuration,
        averageTickDuration,
        totalRedrawDuration,
        averageRedrawDuration,
    });

    if (generationsCounter < properties.generationsCount) {
        // Always use a setTimeout, even with a value of 0, so to
        // let the browser engine have some time to redraw the screen
        // or do other stuffs
        animationTimeOutId = setTimeout(() => {
            animationId = requestAnimationFrame(renderLoop);
        }, properties.throttleValue);
    } else {
        generationsOver = true;

        ui.openResults();
    }
}

function play() {
    if (generationPaused) {
        startedGenerationTime += new Date().getTime() - generationPaused;
    } else {
        if (generationsOver) {
            createUniverse();
        }

        startedGenerationTime = new Date().getTime();
    }

    ui.setPlayPause('PAUSE');

    generationPaused = 0;

    renderLoop();
}

function pause() {
    cancelAnimationFrame(animationId);
    clearTimeout(animationTimeOutId);

    generationPaused = new Date().getTime();

    ui.setPlayPause('PLAY');
}

function reset() {
    createUniverse();
    ui.setPlayPause('PLAY');
}

function drawCell(row, column) {
    universe.drawCell(row, column);
}

function displayColony(colony) {
    universe.clear();

    for (let cell of colony) {
        universe.drawCell(cell[0], cell[1]);
    }
}

function grabColony() {
    return universe.getColony();
}
