import { Ui, ColonyGenerationType, EngineGenerationType } from './ui';
import { Canvas } from './canvas';
import { UniverseJs } from './game-of-life-javascript';
import { UniverseWasm } from './game-of-life-wasm';

let universe;

let generationsCount;
let totalTicksTime;
let startedGenerationTime;
let loopRendering = false;

const ui = Ui(createUniverse, playClicked, pauseClicked, resetClicked);
const canvas = Canvas();

createUniverse();

//
// Functions
//

function createUniverse() {
    loopRendering = false;

    setTimeout(() => {
        if (universe) {
            universe.dispose();
        }

        canvas.setCanvas(ui.getWidth(), ui.getHeight(), ui.getCellSize());

        universe = createUniverseEngine();

        canvas.drawAllCells(universe.getAllCells());

        generationsCount = 0;
        totalTicksTime = 0;
    }, ui.getThrottle() + 100);
}

function createUniverseEngine() {
    const width = ui.getWidth();
    const height = ui.getHeight();
    const isGenerationTypeRandomly =
        ui.getColonyGenerationType() === ColonyGenerationType.Randomly
            ? true
            : false;

    if (ui.getEngineGenerationType() === EngineGenerationType.Wasm) {
        return UniverseWasm().create(width, height, isGenerationTypeRandomly);
    } else {
        return UniverseJs().create(width, height, isGenerationTypeRandomly);
    }
}

function renderLoop() {
    const beforeTicks = new Date().getTime();

    universe.tick(ui.getTicksAtOnce());

    totalTicksTime += new Date().getTime() - beforeTicks;

    generationsCount += ui.getTicksAtOnce();
    ui.setUiCounter(generationsCount);

    if (ui.getTicksAtOnce() > 1) {
        canvas.drawAllCells(universe.getAllCells());
    } else {
        canvas.drawUpdatedCells(universe.getUpdatedCells());
    }

    if (loopRendering) {
        if (generationsCount < ui.getNumberOfGenerations()) {
            setTimeout(() => {
                requestAnimationFrame(renderLoop);
            }, ui.getThrottle());
        } else {
            loopRendering = false;
            ui.setPlayButton();

            const now = new Date().getTime();

            console.log(
                `Total time for ${generationsCount} generations (tick + redraw): ${
                    now - startedGenerationTime
                }`
            );

            console.log(`Total ticks time (Rust - WASM): ${totalTicksTime}`);

            console.log(
                `Average time per tick: ${totalTicksTime / generationsCount}`
            );

            console.log(
                `Total redraw time (Javascript): ${
                    now - startedGenerationTime - totalTicksTime
                }`
            );

            console.log(
                `Average redraw time per generation: ${
                    (now - startedGenerationTime - totalTicksTime) /
                    generationsCount
                }`
            );
        }
    }
}

function playClicked() {
    loopRendering = true;
    startedGenerationTime = new Date().getTime();
    requestAnimationFrame(renderLoop);
}

function pauseClicked() {
    loopRendering = false;
}

function resetClicked() {
    loopRendering = false;

    setTimeout(() => {
        ui.setUiCounter(0);
        createUniverse();
    }, ui.getThrottle() + 1);
}
