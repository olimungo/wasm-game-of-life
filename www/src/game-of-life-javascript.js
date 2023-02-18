export function UniverseJs() {
    const DEAD_COLOR = '#242c37';
    const ALIVE_COLOR = '#4fe4c1';

    let rowCount, columnCount, cellSize, colony, updatedCells;

    const uiCanvas = document.getElementById('ui-canvas');
    const context = uiCanvas.getContext('2d');

    return {
        create,
        dispose,
        clear,
        generatePatternColony,
        generateRandomColony,
        tick,
        getColony,
        setCell,
        drawCell,
        drawAllCells,
        drawUpdatedCells,
    };

    function create(newRowCount, newColumnCount, newCellSize) {
        rowCount = newRowCount;
        columnCount = newColumnCount;
        cellSize = newCellSize;

        colony = Array(rowCount * columnCount).fill(false);
        updatedCells = [];

        return this;
    }

    function dispose() {
        colony = [];
        updatedCells = [];
    }

    function clear() {
        colony = Array(rowCount * columnCount).fill(false);
        updatedCells = [];

        context.beginPath();
        context.fillStyle = DEAD_COLOR;
        context.fillRect(0, 0, columnCount * cellSize, rowCount * cellSize);
        context.closePath();
    }

    function generatePatternColony() {
        generateColony(false);
    }

    function generateRandomColony() {
        generateColony(true);
    }

    function generateColony(randomly) {
        for (let index = 0; index < columnCount * rowCount; index++) {
            if (randomly) {
                colony[index] = Math.random() < 0.5 ? true : false;
            } else {
                colony[index] = index % 2 == 0 || index % 7 == 0;
            }
        }
    }

    function setCell(row, column) {
        const index = getIndex(row, column);
        const state = !colony[index];

        colony[index] = state;
    }

    function drawCell(row, column) {
        const index = getIndex(row, column);
        const state = !colony[index];
        let radius = cellSize / 2;

        colony[index] = state;

        if (state) {
            context.fillStyle = ALIVE_COLOR;
            radius = radius > 2 ? radius - 1 : 1;
        } else {
            context.fillStyle = DEAD_COLOR;
        }

        drawShape(row, column, cellSize, radius);

        context.closePath();
    }

    function tick(generations) {
        updatedCells = [];

        for (let generation = 0; generation < generations; generation++) {
            const newColony = [];

            for (let index = 0; index < columnCount * rowCount; index++) {
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

    function getColony() {
        const liveCells = [];

        colony.forEach((state, index) => {
            if (state) {
                const { row, column } = getRowColumn(index);
                liveCells.push([row, column]);
            }
        });

        return liveCells;
    }

    function drawUpdatedCells() {
        // Because it costs more processing time, we're doing it in 2
        // passes to avoid to change the fill color constantly...
        drawUpdatedCellsByState(true);
        drawUpdatedCellsByState(false);
    }

    function drawAllCells() {
        let radius = cellSize / 2 - 1;

        context.beginPath();

        // Erase canvas
        context.fillStyle = DEAD_COLOR;

        context.fillRect(0, 0, columnCount * cellSize, rowCount * cellSize);

        // Fill canvas with live cells
        context.fillStyle = ALIVE_COLOR;

        for (let row = 0; row < rowCount; row++) {
            for (let column = 0; column < columnCount; column++) {
                const index = getIndex(row, column);

                if (!colony[index]) {
                    continue;
                }

                drawShape(row, column, cellSize, radius);
            }
        }

        context.closePath();
    }

    function drawUpdatedCellsByState(state) {
        let radius = cellSize / 2;

        context.beginPath();

        if (state) {
            context.fillStyle = ALIVE_COLOR;
            radius = radius > 2 ? radius - 1 : 1;
        } else {
            context.fillStyle = DEAD_COLOR;
        }

        for (let element of updatedCells) {
            if (element.state !== state) {
                continue;
            }

            drawShape(element.row, element.column, cellSize, radius);
        }

        context.closePath();
    }

    function liveNeighbourCount(row, column) {
        let count = 0;

        let north = row == 0 ? rowCount - 1 : row - 1;
        let south = row == rowCount - 1 ? 0 : row + 1;
        let west = column == 0 ? columnCount - 1 : column - 1;
        let east = column == columnCount - 1 ? 0 : column + 1;

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
        return row * columnCount + column;
    }

    function getRowColumn(index) {
        const row = Math.floor(index / columnCount);
        const column = index % columnCount;

        return { row, column };
    }

    function drawShape(row, column, cellSize, radius) {
        if (cellSize < 4) {
            context.fillRect(
                column * cellSize,
                row * cellSize,
                cellSize,
                cellSize
            );
        } else {
            context.beginPath();

            context.arc(
                column * cellSize + cellSize / 2,
                row * cellSize + cellSize / 2,
                radius,
                0,
                2 * Math.PI
            );

            context.fill();
        }
    }
}
