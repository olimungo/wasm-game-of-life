import { Universe } from 'wasm-game-of-life';

export function UniverseWasm() {
    let universe;

    return {
        create,
        dispose,
        generatePatternColony,
        generateRandomColony,
        tick,
        setCell,
        drawCell,
        drawAllCells,
        drawUpdatedCells,
    };

    function create(rowCount, columnCount, cellSize) {
        universe = Universe.new(rowCount, columnCount, cellSize);
        return this;
    }

    function dispose() {
        if (universe) {
            universe.free();
            universe = null;
        }
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
}
