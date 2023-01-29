export function Canvas(cellClickedCallback) {
    let width, height, cellSize;

    const uiCanvas = document.getElementById('ui-canvas');

    uiCanvas.addEventListener('click', (event) => {
        const { row, column } = getCanvasClickCoordinates(event);
        cellClickedCallback(row, column);
    });

    return { setCanvas };

    function setCanvas(newWidth, newHeight, newCellSize) {
        width = newWidth;
        height = newHeight;
        cellSize = newCellSize;

        uiCanvas.width = cellSize * width;
        uiCanvas.height = cellSize * height;
    }

    function getCanvasClickCoordinates(event) {
        const boundingRect = uiCanvas.getBoundingClientRect();

        const scaleX = width / boundingRect.width;
        const scaleY = height / boundingRect.height;

        const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
        const canvasTop = (event.clientY - boundingRect.top) * scaleY;

        const row = Math.floor(canvasTop);
        const column = Math.floor(canvasLeft);

        return { row, column };
    }
}
