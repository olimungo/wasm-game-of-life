export const ColonyGenerationType = Object.freeze({
    Pattern: Symbol('pattern'),
    Randomly: Symbol('randomly'),
});

export const EngineGenerationType = Object.freeze({
    Wasm: Symbol('wasm'),
    Javascript: Symbol('javascript'),
});

export function Ui(
    playClickedCallback,
    pauseClickedCallback,
    resetClickedCalback
) {
    const githubSourcesUrl = 'https://github.com/olimungo/wasm-game-of-life';

    let cellSize; // px
    let width; // px
    let height; // px
    let numberOfGenerations;
    let ticksAtOnce;
    let throttle; // ms
    let colonyGenerationType;
    let engineGenerationType;

    //
    // HTML elements reference
    //

    // Inputs
    const uiWidth = document.getElementById('ui-width');
    const uiHeight = document.getElementById('ui-height');
    const uiCounter = document.getElementById('ui-counter');
    const uiCellSize = document.getElementById('ui-cell-size');
    const uiNumberOfGenerations = document.getElementById(
        'ui-number-of-generations'
    );
    const uiGenerationsAtOnce = document.getElementById(
        'ui-generations-at-once'
    );
    const uiThrottle = document.getElementById('ui-throttle');

    // Radio buttons
    const uiColonyGenerationTypes = document.querySelectorAll(
        'input[name="ui-colony-generation-type"]'
    );
    const uiEngineGenerationTypes = document.querySelectorAll(
        'input[name="ui-engine-generation-type"]'
    );

    // Buttons
    const uiSet = document.getElementById('ui-set');
    const uiPlayPause = document.getElementById('ui-play-pause');
    const uiReset = document.getElementById('ui-reset');
    const uiSourceCode = document.getElementById('ui-source-code');

    // Results
    const uiOpenResultsPanel = document.getElementById('ui-open-results-panel');
    const uiTotalDuration = document.getElementById('ui-total-duration');
    const uiTotalTicksDuration = document.getElementById(
        'ui-total-ticks-duration'
    );
    const uiAverageTickDuration = document.getElementById(
        'ui-average-tick-duration'
    );
    const uiTotalRedrawDuration = document.getElementById(
        'ui-total-redraw-duration'
    );
    const uiAverageRedrawDuration = document.getElementById(
        'ui-average-redraw-duration'
    );

    initProperties();
    addEventListeners();

    return {
        getWidth,
        getHeight,
        getCellSize,
        getTicksAtOnce,
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
    // Getters
    //

    function getWidth() {
        return width;
    }

    function getHeight() {
        return height;
    }

    function getTicksAtOnce() {
        return ticksAtOnce;
    }

    function getCellSize() {
        return cellSize;
    }

    function getColonyGenerationType() {
        return colonyGenerationType;
    }

    function getEngineGenerationType() {
        return engineGenerationType;
    }

    function getThrottle() {
        return throttle;
    }

    function getNumberOfGenerations() {
        return numberOfGenerations;
    }

    //
    // Functions
    //

    function initProperties() {
        for (let radioButton of uiEngineGenerationTypes) {
            if (radioButton.checked) {
                engineGenerationType =
                    radioButton.value === 'wasm'
                        ? EngineGenerationType.Wasm
                        : EngineGenerationType.Javascript;
            }
        }

        for (let radioButton of uiColonyGenerationTypes) {
            if (radioButton.checked) {
                colonyGenerationType =
                    radioButton.value === 'pattern'
                        ? ColonyGenerationType.Pattern
                        : ColonyGenerationType.Randomly;
            }
        }

        width = parseInt(uiWidth.value);
        height = parseInt(uiHeight.value);
        cellSize = parseInt(uiCellSize.value);
        numberOfGenerations = parseInt(uiNumberOfGenerations.value);
        ticksAtOnce = parseInt(uiGenerationsAtOnce.value);
        throttle = parseInt(uiThrottle.value);

        setUiCounter(0);
    }

    function setUiCounter(count) {
        uiCounter.textContent = count;
    }

    function setPlayButton() {
        uiPlayPause.textContent = 'PLAY';
    }

    function reset() {
        uiPlayPause.textContent = 'PLAY';
        resetClickedCalback();
    }

    function unwrapDefault(value, defaultValue) {
        const intValue = parseInt(value);

        if (!isNaN(intValue)) {
            return intValue;
        }

        return defaultValue;
    }

    function addEventListeners() {
        for (const radioButton of uiEngineGenerationTypes) {
            radioButton.addEventListener('change', (e) => {
                engineGenerationType =
                    e.target.value === 'wasm'
                        ? EngineGenerationType.Wasm
                        : EngineGenerationType.Javascript;

                reset();
            });
        }

        uiNumberOfGenerations.addEventListener(
            'change',
            (e) =>
                (numberOfGenerations = unwrapDefault(
                    e.target.value,
                    numberOfGenerations
                ))
        );

        uiNumberOfGenerations.addEventListener(
            'keyup',
            (e) =>
                (numberOfGenerations = unwrapDefault(
                    e.target.value,
                    numberOfGenerations
                ))
        );

        uiGenerationsAtOnce.addEventListener(
            'change',
            (e) => (ticksAtOnce = unwrapDefault(e.target.value, ticksAtOnce))
        );

        uiGenerationsAtOnce.addEventListener(
            'keyup',
            (e) => (ticksAtOnce = unwrapDefault(e.target.value, ticksAtOnce))
        );

        uiThrottle.addEventListener(
            'change',
            (e) => (throttle = unwrapDefault(e.target.value, throttle))
        );

        uiThrottle.addEventListener(
            'keyup',
            (e) => (throttle = unwrapDefault(e.target.value, throttle))
        );

        for (const radioButton of uiColonyGenerationTypes) {
            radioButton.addEventListener('change', (e) => {
                colonyGenerationType =
                    e.target.value === 'pattern'
                        ? ColonyGenerationType.Pattern
                        : ColonyGenerationType.Randomly;

                reset();
            });
        }

        function set() {
            width = unwrapDefault(uiWidth.value, width);
            height = unwrapDefault(uiHeight.value, height);
            cellSize = unwrapDefault(uiCellSize.value, cellSize);

            reset();
        }

        uiSet.addEventListener('click', set);
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

        uiOpenResultsPanel.addEventListener('click', () => {
            if (uiOpenResultsPanel.classList.contains('open')) {
                uiOpenResultsPanel.classList.remove('open');
            } else {
                uiOpenResultsPanel.classList.add('open');
            }
        });

        uiSourceCode.addEventListener('click', () =>
            window.open(githubSourcesUrl, '_blank')
        );
    }

    function openResults() {
        if (!uiOpenResultsPanel.classList.contains('open')) {
            uiOpenResultsPanel.classList.add('open');
        }
    }

    function setResults(results) {
        uiTotalDuration.textContent = (
            Math.round(results.totalDuration * 100) / 100
        ).toFixed(2);

        uiTotalTicksDuration.textContent = (
            Math.round(results.totalTicksDuration * 100) / 100
        ).toFixed(2);

        uiAverageTickDuration.textContent = (
            Math.round(results.averageTickDuration * 100) / 100
        ).toFixed(2);

        uiTotalRedrawDuration.textContent = (
            Math.round(results.totalRedrawDuration * 100) / 100
        ).toFixed(2);

        uiAverageRedrawDuration.textContent = (
            Math.round(results.averageRedrawDuration * 100) / 100
        ).toFixed(2);
    }

    function resetResults() {
        setResults({
            totalDuration: 0,
            totalTicksDuration: 0,
            averageTickDuration: 0,
            totalRedrawDuration: 0,
            averageRedrawDuration: 0,
        });
    }
}
