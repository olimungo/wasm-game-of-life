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

    function drawAllCells(cells) {
        context.beginPath();

        for (let row = 0; row < height; row++) {
            for (let column = 0; column < width; column++) {
                const index = getIndex(row, column);

                context.fillStyle = bitIsSet(index, cells)
                    ? ALIVE_COLOR
                    : DEAD_COLOR;

                context.fillRect(
                    column * cellSize,
                    row * cellSize,
                    cellSize,
                    cellSize
                );
            }
        }

        context.stroke();
    }

    function drawUpdatedCells(updatedCells) {
        context.beginPath();

        for (let element = 0; element < updatedCells.length; element++) {
            const row = updatedCells.rows[element];
            const column = updatedCells.columns[element];
            const state = updatedCells.states[element];

            context.fillStyle = state ? ALIVE_COLOR : DEAD_COLOR;
            context.fillRect(
                column * cellSize,
                row * cellSize,
                cellSize,
                cellSize
            );
        }

        context.stroke();
    }

    function getIndex(row, column) {
        return row * width + column;
    }

    function bitIsSet(n, arr) {
        const byte = Math.floor(n / 8);
        const mask = 1 << n % 8;
        return (arr[byte] & mask) === mask;
    }
}
