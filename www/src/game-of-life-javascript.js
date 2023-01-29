export function UniverseJs() {
    const DEAD_COLOR = '#FFFFFF';
    const ALIVE_COLOR = '#000000';

    let width, height, cellSize, colony, updatedCells;

    const uiCanvas = document.getElementById('ui-canvas');
    const context = uiCanvas.getContext('2d');

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

    function create(newWidth, newHeight, newCellSize) {
        width = newWidth;
        height = newHeight;
        cellSize = newCellSize;

        colony = [];
        updatedCells = [];

        return this;
    }

    function dispose() {
        colony = [];
        updatedCells = [];
    }

    function setCell(row, column, state) {
        const index = getIndex(row, column);
        colony[index] = state;
    }

    function drawCell(row, column) {
        const index = getIndex(row, column);
        const state = colony[index];

        if (state) {
            context.fillStyle = DEAD_COLOR;
        } else {
            context.fillStyle = ALIVE_COLOR;
        }

        colony[index] = !state;

        context.beginPath();

        context.fillRect(column * cellSize, row * cellSize, cellSize, cellSize);

        context.closePath();
    }

    function tick(generations) {
        updatedCells = [];

        for (let generation = 0; generation < generations; generation++) {
            const newColony = [];

            for (let index = 0; index < width * height; index++) {
                const previousState = colony[index];
                const { row, column } = getRowColumn(index);
                const count = liveNeighbourCount(row, column);

                const newState =
                    (count === 2 && previousState) || count === 3
                        ? true
                        : false;

                newColony.push(newState);

                // If we process more than 1 generation, we can't rely on the updated cells
                if (generations === 1 && previousState !== newState) {
                    updatedCells.push({ row, column, state: newState });
                }
            }

            colony = newColony;
        }
    }

    function generatePatternColony() {
        generateColony(false);
    }

    function generateRandomColony() {
        generateColony(true);
    }

    function generateColony(randomly) {
        for (let index = 0; index < width * height; index++) {
            if (randomly) {
                colony.push(Math.random() < 0.5 ? true : false);
            } else {
                colony.push(index % 2 == 0 || index % 7 == 0);
            }
        }
    }

    function drawAllCells() {
        console.log(colony);
        context.beginPath();

        drawAllCellsByState(colony, true);
        drawAllCellsByState(colony, false);

        context.closePath();
    }

    function drawUpdatedCells() {
        context.beginPath();

        drawUpdatedCellsByState(updatedCells, true);
        drawUpdatedCellsByState(updatedCells, false);

        context.closePath();
    }

    function drawAllCellsByState(colony, state) {
        if (state) {
            context.fillStyle = ALIVE_COLOR;
        } else {
            context.fillStyle = DEAD_COLOR;
        }

        for (let row = 0; row < height; row++) {
            for (let column = 0; column < width; column++) {
                const index = getIndex(row, column);

                if (colony[index] !== state) {
                    continue;
                }

                context.fillRect(
                    column * cellSize,
                    row * cellSize,
                    cellSize,
                    cellSize
                );
            }
        }
    }

    function drawUpdatedCellsByState(updatedCells, state) {
        if (state) {
            context.fillStyle = ALIVE_COLOR;
        } else {
            context.fillStyle = DEAD_COLOR;
        }

        for (let element of updatedCells) {
            if (element.state !== state) {
                continue;
            }

            context.fillRect(
                element.column * cellSize,
                element.row * cellSize,
                cellSize,
                cellSize
            );
        }
    }

    function liveNeighbourCount(row, column) {
        let count = 0;

        let north = row == 0 ? height - 1 : row - 1;
        let south = row == height - 1 ? 0 : row + 1;
        let west = column == 0 ? width - 1 : column - 1;
        let east = column == width - 1 ? 0 : column + 1;

        let nw = getIndex(north, west);
        count += colony[nw];

        let n = getIndex(north, column);
        count += colony[n];

        let ne = getIndex(north, east);
        count += colony[ne];

        let w = getIndex(row, west);
        count += colony[w];

        let e = getIndex(row, east);
        count += colony[e];

        let sw = getIndex(south, west);
        count += colony[sw];

        let s = getIndex(south, column);
        count += colony[s];

        let se = getIndex(south, east);
        count += colony[se];

        return count;
    }

    function getIndex(row, column) {
        return row * width + column;
    }

    function getRowColumn(index) {
        const row = Math.floor(index / width);
        const column = index % width;

        return { row, column };
    }
}
