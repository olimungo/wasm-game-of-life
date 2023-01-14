import { Universe } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';
import { Ui } from './ui';
import { Canvas } from './canvas';

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

function renderLoop() {
    const beforeTicks = new Date().getTime();

    universe.tick(ui.getTicksAtOnce());

    totalTicksTime += new Date().getTime() - beforeTicks;

    generationsCount += ui.getTicksAtOnce();
    ui.setUiCounter(generationsCount);

    if (ui.getTicksAtOnce() > 1) {
        canvas.drawAllCells(getAllCellsFromWasm());
    } else {
        canvas.drawUpdatedCells(getUpdatedCellsFromWasm());
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

function createUniverse() {
    loopRendering = false;

    setTimeout(() => {
        canvas.setCanvas(ui.getWidth(), ui.getHeight(), ui.getCellSize());

        universe = Universe.new(
            ui.getWidth(),
            ui.getHeight(),
            ui.getColonyGenerationType()
        );

        canvas.drawAllCells(getAllCellsFromWasm());

        generationsCount = 0;
        totalTicksTime = 0;
    }, ui.getThrottle() + 1);
}

function getAllCellsFromWasm() {
    const cellsPtr = universe.cells();

    return [
        ...new Uint8Array(
            memory.buffer,
            cellsPtr,
            (ui.getWidth() * ui.getHeight()) / 8
        ),
    ];
}

function getUpdatedCellsFromWasm() {
    const length = universe.updated_cells_length();

    let pointer = universe.updated_cells_rows();
    let data = new Uint32Array(memory.buffer, pointer, length);
    const rows = [...data];

    pointer = universe.updated_cells_columns();
    data = new Uint32Array(memory.buffer, pointer, length);
    const columns = [...data];

    pointer = universe.updated_cells_states();
    data = new Uint32Array(memory.buffer, pointer, length);
    const states = [...data];

    return { rows, columns, states, length };
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
