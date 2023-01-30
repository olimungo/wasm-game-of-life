import { UniverseJs } from './game-of-life-javascript';
import { UniverseWasm } from './game-of-life-wasm';
import { Engine } from './inputs';

export function UniverseFactory(engine, rowCount, columnCount, cellSize) {
    let universe;

    if (engine === Engine.Wasm) {
        universe = UniverseWasm().create(rowCount, columnCount, cellSize);
    } else {
        universe = UniverseJs().create(rowCount, columnCount, cellSize);
    }

    return universe;
}
