import { Universe } from 'wasm-game-of-life';
import { Canvas } from './canvas';

export function UniverseWasm() {
    let universe;

    const canvas = Canvas();

    return {
        create,
        dispose,
        generatePatternColony,
        generateRandomColony,
        tick,
        drawAllCells,
        drawUpdatedCells,
    };

    function create(width, height, cellSize) {
        universe = Universe.new(width, height, cellSize);

        canvas.setCanvas(width, height, cellSize);

        return this;
    }

    function dispose() {
        if (universe) {
            universe.free();
            universe = null;
        }
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
