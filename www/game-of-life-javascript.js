export function UniverseJs() {
    let width, height, allCells, updatedCells;

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

        allCells = [];
        updatedCells = [];

        for (let index = 0; index < width * height; index++) {
            if (randomly) {
                allCells.push(Math.random() < 0.5 ? true : false);
            } else {
                allCells.push(index % 2 == 0 || index % 7 == 0);
            }
        }

        return this;
    }

    function dispose() {
        allCells = [];
        updatedCells = [];
    }

    function tick(generations) {
        const newAllCells = [];
        updatedCells = [];

        for (let generation = 0; generation < generations; generation++) {
            for (let index = 0; index < width * height; index++) {
                const previousState = allCells[index];
                const { row, column } = getRowColumn(index);
                const count = liveNeighbourCount(row, column);

                const newState =
                    (count === 2 && previousState) || count === 3
                        ? true
                        : false;

                newAllCells.push(newState);

                if (previousState !== newState) {
                    updatedCells.push({ row, column, state: newState });
                }
            }
        }

        allCells = newAllCells;
    }

    function getAllCells() {
        return allCells;
    }

    function getUpdatedCells() {
        return updatedCells;
    }

    function getIndex(row, column) {
        return row * width + column;
    }

    function getRowColumn(index) {
        const row = Math.floor(index / width);
        const column = index % height;

        return { row, column };
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

                count += allCells[index];
            }
        }

        return count;
    }
}
