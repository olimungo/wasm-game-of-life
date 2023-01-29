import { Throttle } from './throttle';
import { Benchmarks } from './benchmarks';
import { Inputs } from './inputs';
import { Library } from './library';

export function Ui(
    playClickedCallback,
    pauseClickedCallback,
    resetClickedCalback,
    cellClickedCallback,
    libraryItemSelectedCallback
) {
    const githubSourcesUrl = 'https://github.com/olimungo/wasm-game-of-life';

    const inputs = Inputs(reset);
    const throttle = Throttle();
    const benchmarks = Benchmarks();

    Library(libraryItemSelectedCallback);

    //
    // HTML elements reference
    //

    // Buttons
    const uiSet = document.getElementById('ui-set');
    const uiPlayPause = document.getElementById('ui-play-pause');
    const uiReset = document.getElementById('ui-reset');
    const uiSourceCode = document.getElementById('ui-source-code');

    // Canvas
    const uiCanvas = document.getElementById('ui-canvas');

    addEventListeners();

    return {
        getWidth,
        getHeight,
        getCellSize,
        getGenerationsAtOnce,
        getThrottle,
        getColonyGenerationType,
        getEngineGenerationType,
        getNumberOfGenerations,
        setUiCounter,
        setPlayButton,
        setResults,
        resetResults,
        openResults,
    };

    //
    // Getters/Setters
    //

    function getWidth() {
        return inputs.getWidth();
    }

    function getHeight() {
        return inputs.getHeight();
    }

    function getGenerationsAtOnce() {
        return inputs.getGenerationsAtOnce();
    }

    function getCellSize() {
        return inputs.getCellSize();
    }

    function getColonyGenerationType() {
        return inputs.getColonyGenerationType();
    }

    function getEngineGenerationType() {
        return inputs.getEngineGenerationType();
    }

    function getThrottle() {
        return throttle.getThrottle();
    }

    function getNumberOfGenerations() {
        return inputs.getNumberOfGenerations();
    }

    function setUiCounter(count) {
        inputs.setUiCounter(count);
    }

    //
    // Functions
    //

    function setPlayButton() {
        uiPlayPause.textContent = 'PLAY';
    }

    function reset() {
        uiPlayPause.textContent = 'PLAY';
        resetClickedCalback();
    }

    function addEventListeners() {
        uiSet.addEventListener('click', reset);
        uiReset.addEventListener('click', reset);

        uiPlayPause.addEventListener('click', (e) => {
            if (uiPlayPause.textContent === 'PAUSE') {
                uiPlayPause.textContent = 'PLAY';
                pauseClickedCallback();
            } else {
                uiPlayPause.textContent = 'PAUSE';
                playClickedCallback();
            }
        });

        uiSourceCode.addEventListener('click', () =>
            window.open(githubSourcesUrl, '_blank')
        );

        uiCanvas.addEventListener('click', (event) => {
            const { row, column } = getCanvasClickCoordinates(event);
            cellClickedCallback(row, column);
        });
    }

    function getCanvasClickCoordinates(event) {
        const boundingRect = uiCanvas.getBoundingClientRect();

        const scaleX = uiCanvas.width / boundingRect.width;
        const scaleY = uiCanvas.height / boundingRect.height;

        const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
        const canvasTop = (event.clientY - boundingRect.top) * scaleY;

        const row = Math.min(Math.floor(canvasTop / cellSize), height - 1);
        const column = Math.min(Math.floor(canvasLeft / cellSize), width - 1);

        return { row, column };
    }

    function openResults() {
        benchmarks.openResults();
    }

    function setResults(results) {
        benchmarks.setResults(results);
    }

    function resetResults() {
        benchmarks.resetResults();
    }
}
