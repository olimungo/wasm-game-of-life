import { Universe } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

const CELL_SIZE = 5; // px
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#000000';
const MAX_TICK = 10000;
const TICK_AT_ONCE = 1;

let WIDTH = 100;
let HEIGHT = 100;
let universe;

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Construct the universe, and get its width and height.
const createUniverse = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    universe = Universe.new(WIDTH, HEIGHT);
    canvas.height = (CELL_SIZE + 1) * HEIGHT + 1;
    canvas.width = (CELL_SIZE + 1) * WIDTH + 1;
};

const drawCells = () => {
    const changedCellsLen = universe.changed_cells_len();

    let pointer = universe.changed_cells_rows();
    let data = new Uint32Array(memory.buffer, pointer, changedCellsLen);
    const changedCellsRows = [...data];

    pointer = universe.changed_cells_cols();
    data = new Uint32Array(memory.buffer, pointer, changedCellsLen);
    const changedCellsCols = [...data];

    pointer = universe.changed_cells_states();
    data = new Uint32Array(memory.buffer, pointer, changedCellsLen);
    const changedCellsStates = [...data];

    context.beginPath();

    for (let element = 0; element < changedCellsLen; element++) {
        const row = changedCellsRows[element];
        const col = changedCellsCols[element];
        const state = changedCellsStates[element];

        context.fillStyle = state ? ALIVE_COLOR : DEAD_COLOR;

        context.fillRect(
            col * (CELL_SIZE + 1) + 1,
            row * (CELL_SIZE + 1) + 1,
            CELL_SIZE,
            CELL_SIZE
        );
    }

    context.stroke();
};

const drawGrid = () => {
    context.beginPath();
    context.strokeStyle = GRID_COLOR;
    context.lineWidth = 0.1;

    // Vertical lines.
    for (let i = 0; i <= WIDTH; i++) {
        context.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        context.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * HEIGHT + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= HEIGHT; j++) {
        context.moveTo(0, j * (CELL_SIZE + 1) + 1);
        context.lineTo((CELL_SIZE + 1) * WIDTH + 1, j * (CELL_SIZE + 1) + 1);
    }

    context.stroke();
};

let tickCount = 0;

const renderLoop = () => {
    tickCount += TICK_AT_ONCE;

    drawGrid();
    drawCells();

    universe.tick(TICK_AT_ONCE);

    if (tickCount < MAX_TICK) {
        // setTimeout(() => {
        requestAnimationFrame(renderLoop);
        // }, 50);
    }
};

const sliderWidth = document.getElementById('sliderWidth');
const sliderWidthValue = document.getElementById('sliderWidthValue');
const sliderHeight = document.getElementById('sliderHeight');
const sliderHeightValue = document.getElementById('sliderHeightValue');

sliderWidth.addEventListener('input', (e) => {
    sliderWidthValue.textContent = e.target.value;
});

sliderHeight.addEventListener('input', (e) => {
    sliderHeightValue.textContent = e.target.value;
});

sliderWidth.addEventListener('change', (e) => {
    WIDTH = e.target.value;
    createUniverse();
});

sliderHeight.addEventListener('change', (e) => {
    HEIGHT = e.target.value;
    createUniverse();
});

createUniverse();
drawGrid();
requestAnimationFrame(renderLoop);
