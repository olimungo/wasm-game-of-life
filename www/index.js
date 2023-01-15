import { Ui, ColonyGenerationType, EngineGenerationType } from './ui';
import { Canvas } from './canvas';
import { UniverseJs } from './game-of-life-javascript';
import { UniverseWasm } from './game-of-life-wasm';

let universe;

let generationsCount;
let totalTicksDuration;
let startedGenerationTime;
let loopRendering = false;
let generationsOver = false;
let generationPaused = false;

const ui = Ui(propsUpdated, playClicked, pauseClicked, resetClicked);
const canvas = Canvas();

createUniverse();

//
// Functions
//

function propsUpdated() {
    loopRendering = false;

    setTimeout(() => {
        createUniverse();
    }, ui.getThrottle() + 100);
}

function createUniverse() {
    if (universe) {
        universe.dispose();
    }

    canvas.setCanvas(ui.getWidth(), ui.getHeight(), ui.getCellSize());

    universe = createUniverseFactory();

    canvas.drawAllCells(universe.getAllCells());

    generationsCount = 0;
    totalTicksDuration = 0;
}

function createUniverseFactory() {
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

    if (loopRendering) {
        totalTicksDuration += new Date().getTime() - beforeTicks;
        generationsCount += ui.getTicksAtOnce();

        ui.setUiCounter(generationsCount);

        if (ui.getTicksAtOnce() > 1) {
            canvas.drawAllCells(universe.getAllCells());
        } else {
            canvas.drawUpdatedCells(universe.getUpdatedCells());
        }

        if (generationsCount < ui.getNumberOfGenerations()) {
            setTimeout(() => {
                requestAnimationFrame(renderLoop);
            }, ui.getThrottle());
        } else {
            loopRendering = false;
            generationsOver = true;

            ui.setPlayButton();

            if (!generationPaused) {
                const now = new Date().getTime();
                const totalDuration = now - startedGenerationTime;
                const averageTickDuration =
                    totalTicksDuration / generationsCount;
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
}

function playClicked() {
    loopRendering = true;

    if (generationsOver) {
        generationsOver = false;
        generationPaused = false;

        ui.setUiCounter(0);
        ui.resetResults();

        createUniverse();
    }

    startedGenerationTime = new Date().getTime();

    requestAnimationFrame(renderLoop);
}

function pauseClicked() {
    loopRendering = false;
    generationPaused = true;
}

function resetClicked() {
    loopRendering = false;
    generationsOver = false;
    generationPaused = false;

    setTimeout(() => {
        ui.setUiCounter(0);
        ui.resetResults();

        createUniverse();
    }, ui.getThrottle() + 100);
}
