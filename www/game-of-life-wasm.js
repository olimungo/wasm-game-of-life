import { Universe } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

export function UniverseWasm() {
    let width, height, universe;

    return {
        create,
        dispose,
        generatePatternColony,
        generateRandomColony,
        tick,
        getColony,
        getUpdatedCells,
    };

    function create(newWidth, newHeight) {
        width = newWidth;
        height = newHeight;

        universe = Universe.new(width, height);

        return this;
    }

    function dispose() {
        if (universe) {
            universe.free();
            universe = null;
        }
    }

    function generatePatternColony() {
        universe.generate_pattern_colony();
    }

    function generateRandomColony() {
        universe.generate_random_colony();
    }

    function tick(generations) {
        universe.tick(generations);
    }

    function getColony() {
        const cellsPtr = universe.colony();

        const wasm_cells = new Uint8Array(
            memory.buffer,
            cellsPtr,
            (width * height) / 8
        );

        const colony = [];

        for (let index = 0; index < width * height; index++) {
            colony.push(bitIsSet(index, wasm_cells));
        }

        return colony;
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
