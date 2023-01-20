export function Canvas() {
    const DEAD_COLOR = '#FFFFFF';
    const ALIVE_COLOR = '#000000';

    let width = 0;
    let height = 0;
    let cellSize = 1;

    const uiCanvas = document.getElementById('ui-canvas');
    const context = uiCanvas.getContext('2d');

    return {
        getWidth,
        setWidth,
        getHeight,
        setHeight,
        setCanvas,
        drawAllCells,
        drawUpdatedCells,
    };

    //
    // Getters/Setters
    //

    function getWidth() {
        return width;
    }

    function setWidth(value) {
        width = value;
    }

    function getHeight() {
        return height;
    }

    function setHeight(value) {
        height = value;
    }

    //
    // Functions
    //

    function setCanvas(newWidth, newHeight, newCellSize) {
        context.clearRect(0, 0, width, height);

        width = newWidth;
        height = newHeight;
        cellSize = newCellSize;

        uiCanvas.width = cellSize * width;
        uiCanvas.height = cellSize * height;
    }

    function drawAllCells(colony) {
        context.beginPath();

        // Alive cells
        context.fillStyle = ALIVE_COLOR;

        for (let row = 0; row < height; row++) {
            for (let column = 0; column < width; column++) {
                const index = getIndex(row, column);

                if (!colony[index]) {
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

        // Dead cells
        context.fillStyle = DEAD_COLOR;

        for (let row = 0; row < height; row++) {
            for (let column = 0; column < width; column++) {
                const index = getIndex(row, column);

                if (colony[index]) {
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

        context.closePath();
    }

    function drawUpdatedCells(updatedCells) {
        context.beginPath();

        // Alive cells
        context.fillStyle = ALIVE_COLOR;

        for (let element of updatedCells) {
            if (!element.state) {
                continue;
            }

            context.fillRect(
                element.column * cellSize,
                element.row * cellSize,
                cellSize,
                cellSize
            );
        }

        // Dead cells
        context.fillStyle = DEAD_COLOR;

        for (let element of updatedCells) {
            if (element.state) {
                continue;
            }

            context.fillRect(
                element.column * cellSize,
                element.row * cellSize,
                cellSize,
                cellSize
            );
        }

        context.closePath();
    }

    function getIndex(row, column) {
        return row * width + column;
    }
}
