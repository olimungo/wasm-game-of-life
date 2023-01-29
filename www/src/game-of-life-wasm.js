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

    function create(width, height, cellSize) {
        universe = Universe.new(width, height, cellSize);
        return this;
    }

    function dispose() {
        if (universe) {
            universe.free();
            universe = null;
        }
    }

    function setCell(row, column, state) {
        // universe.set_cell(row, column, state);
    }

    function drawCell(row, column) {
        universe.set_cell(row, column);
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
