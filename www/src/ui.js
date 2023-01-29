import { Throttle } from './throttle';
import { Benchmarks } from './benchmarks';
import { Inputs } from './inputs';
import { Library } from './library';
import { Canvas } from './canvas';
import { Fps } from './fps';

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
    const canvas = Canvas(cellClickedCallback);
    const fps = Fps();
    const library = Library(libraryItemSelected);

    // Buttons
    const uiSet = document.getElementById('ui-set');
    const uiPlayPause = document.getElementById('ui-play-pause');
    const uiReset = document.getElementById('ui-reset');
    const uiSourceCode = document.getElementById('ui-source-code');

    // Counter
    const uiCounter = document.getElementById('ui-counter');

    let colonySample = library.getDefaultSample();

    addEventListeners();
    updateUi(0);

    return {
        getGenerationsAtOnce,
        getThrottle,
        getColonySample,
        getEngineGenerationType,
        getNumberOfGenerations,
        setCanvasDimensions,
        updateUi,
        setPlayButton,
        setResults,
        resetResults,
        openResults,
    };

    function getGenerationsAtOnce() {
        return inputs.getGenerationsAtOnce();
    }

    function getColonySample() {
        return colonySample;
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

    function updateUi(count) {
        uiCounter.textContent = count;

        fps.render();
    }

    function setPlayButton() {
        uiPlayPause.textContent = 'PLAY';
    }

    function reset() {
        uiPlayPause.textContent = 'PLAY';
        resetClickedCalback();
    }

    function addEventListeners() {
        uiSet.addEventListener('click', () => {
            const width = inputs.getWidth();
            const height = inputs.getHeight();
            const cellSize = inputs.getCellSize();

            colonySample.width = width;
            colonySample.height = height;
            colonySample.cellSize = cellSize;

            canvas.setCanvas(width, height, cellSize);
            reset();
        });

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
    }

    function setCanvasDimensions(width, height, cellSize) {
        inputs.setWidth(width);
        inputs.setHeight(height);
        inputs.setCellSize(cellSize);

        canvas.setCanvas(width, height, cellSize);
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

    function libraryItemSelected(item) {
        colonySample = item;
        libraryItemSelectedCallback(item);
    }
}
