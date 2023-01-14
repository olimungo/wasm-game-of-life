import { Universe } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

export function UniverseWasm() {
    let width, height, universe;

    return {
        create,
        dispose,
        tick,
        getAllCells,
        getUpdatedCells,
    };

    function create(newWidth, newHeight, randomly) {
        width = newWidth;
        height = newHeight;

        universe = Universe.new(width, height, randomly);

        return this;
    }

    function dispose() {
        if (universe) {
            universe.free();
            universe = null;
        }
    }

    function tick(generations) {
        universe.tick(generations);
    }

    function getAllCells() {
        const cellsPtr = universe.cells();

        const wasm_cells = new Uint8Array(
            memory.buffer,
            cellsPtr,
            (width * height) / 8
        );

        const allCells = [];

        for (let index = 0; index < width * height; index++) {
            allCells.push(bitIsSet(index, wasm_cells));
        }

        return allCells;
    }

    function getUpdatedCells() {
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

        const aggregateArray = [];

        for (let index = 0; index < length; index++) {
            const row = rows[index];
            const column = columns[index];
            const state = states[index];

            aggregateArray.push({ row, column, state });
        }

        return aggregateArray;
    }

    function bitIsSet(index, array) {
        const byte = Math.floor(index / 8);
        const mask = 1 << index % 8;
        return (array[byte] & mask) === mask;
    }
}
