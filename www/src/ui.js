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

    // Counter
    const uiCounter = document.getElementById('ui-counter');

    addEventListeners();
    updateUi(0);

    return {
        getGenerationsAtOnce,
        getThrottle,
        getColonyGenerationType,
        getEngineGenerationType,
        getNumberOfGenerations,
        setCanvas,
        updateUi,
        setPlayButton,
        setResults,
        resetResults,
        openResults,
    };

    function getGenerationsAtOnce() {
        return inputs.getGenerationsAtOnce();
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
    }

    function setCanvas() {
        const width = inputs.getWidth();
        const height = inputs.getHeight();
        const cellSize = inputs.getCellSize();

        canvas.setCanvas(width, height, cellSize);

        return { width, height, cellSize };
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
