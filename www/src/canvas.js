export function Canvas(cellClickedCallback) {
    let rowCount, columnCount, cellSize;

    const uiCanvas = document.getElementById('ui-canvas');

    uiCanvas.addEventListener('click', (event) => {
        const { row, column } = getCanvasClickCoordinates(event);
        cellClickedCallback(row, column);
    });

    return { setCanvas };

    function setCanvas(newRowCount, newColumnCount, newCellSize) {
        rowCount = newRowCount;
        columnCount = newColumnCount;
        cellSize = newCellSize;

        uiCanvas.width = cellSize * columnCount;
        uiCanvas.height = cellSize * rowCount;
    }

    function getCanvasClickCoordinates(event) {
        const boundingRect = uiCanvas.getBoundingClientRect();

        const scaleX = columnCount / boundingRect.width;
        const scaleY = rowCount / boundingRect.height;

        const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
        const canvasTop = (event.clientY - boundingRect.top) * scaleY;

        const row = Math.floor(canvasTop);
        const column = Math.floor(canvasLeft);

        return { row, column };
    }
}
