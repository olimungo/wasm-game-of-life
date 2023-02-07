import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';
import { Universe } from 'wasm-game-of-life';

export function UniverseWasm() {
    let universe, rowCount, columnCount;

    return {
        create,
        dispose,
        clear,
        getColony,
        generatePatternColony,
        generateRandomColony,
        tick,
        setCell,
        drawCell,
        drawAllCells,
        drawUpdatedCells,
    };

    function create(newRowCount, newColumnCount, cellSize) {
        rowCount = newRowCount;
        columnCount = newColumnCount;

        universe = Universe.new(rowCount, columnCount, cellSize);

        return this;
    }

    function dispose() {
        if (universe) {
            universe.free();
            universe = null;
        }
    }

    function clear() {
        if (universe) {
            universe.clear();
        }
    }

    function getColony() {
        const colony = [];

        const colonyPointer = universe.get_colony();
        const bitColony = new Uint8Array(
            memory.buffer,
            colonyPointer,
            (rowCount * columnCount) / 8
        );

        for (let index = 0; index < rowCount * columnCount; index++) {
            if (bitIsSet(index, bitColony)) {
                const { row, column } = getRowColumn(index);
                colony.push([row, column]);
            }
        }

        return colony;
    }

    function setCell(row, column) {
        universe.set_cell(row, column);
    }

    function drawCell(row, column) {
        universe.draw_cell(row, column);
    }

    function drawAllCells() {
        universe.draw_all_cells();
    }

    function drawUpdatedCells() {
        universe.draw_updated_cells();
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

    function bitIsSet(n, arr) {
        const byte = Math.floor(n / 8);
        const mask = 1 << n % 8;

        return (arr[byte] & mask) === mask;
    }

    function getRowColumn(index) {
        const row = Math.floor(index / columnCount);
        const column = index % columnCount;

        return { row, column };
    }
}
