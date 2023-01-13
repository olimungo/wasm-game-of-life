import { Universe } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

const CELL_SIZE = 3; // px
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#000000';
const MAX_TICK = 30000;
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

    const cellsPtr = universe.changed_cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, 256);

    console.log(cells);
};

const getIndex = (row, column) => {
    return row * WIDTH + column;
};

const isAlive = (n, arr) => {
    const byte = Math.floor(n / 8);
    const mask = 1 << n % 8;
    return (arr[byte] & mask) === mask;
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, (WIDTH * HEIGHT) / 8);

    context.beginPath();

    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            const index = getIndex(row, col);

            context.fillStyle = isAlive(index, cells)
                ? ALIVE_COLOR
                : DEAD_COLOR;

            context.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    context.stroke();
};

const drawGrid = () => {
    context.beginPath();
    context.strokeStyle = GRID_COLOR;

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

    const changedCellsPtr = universe.changed_cells();
    // const changed_cells = new Uint8Array(memory.buffer, changedCellsPtr);

    // console.log(changed_cells);
    // const x = new ChangedCell();

    // console.log(x);

    if (tickCount <= MAX_TICK) {
        requestAnimationFrame(renderLoop);
    }

    universe.tick(TICK_AT_ONCE);
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
// requestAnimationFrame(renderLoop);
