export function UniverseJs() {
    let width, height, colony, updatedCells;

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

        colony = [];
        updatedCells = [];

        return this;
    }

    function dispose() {
        colony = [];
        updatedCells = [];
    }

    function generatePatternColony() {
        generateColony(false);
    }

    function generateRandomColony() {
        generateColony(true);
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

    function getColony() {
        return colony;
    }

    function getUpdatedCells() {
        return updatedCells;
    }

    function getIndex(row, column) {
        return row * width + column;
    }

    function getRowColumn(index) {
        const row = Math.floor(index / width);
        const column = index % width;

        return { row, column };
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

    function liveNeighbourCount(row, column) {
        let count = 0;

        for (let deltaRow of [height - 1, 0, 1]) {
            for (let deltaColumn of [width - 1, 0, 1]) {
                if (deltaRow === 0 && deltaColumn === 0) {
                    continue;
                }

                const neighbourRow = (row + deltaRow) % height;
                const neighbourColumn = (column + deltaColumn) % width;
                const index = getIndex(neighbourRow, neighbourColumn);

                count += colony[index];
            }
        }

        return count;
    }
}
