export const ColonyGenerationType = Object.freeze({
    Pattern: Symbol('pattern'),
    Randomly: Symbol('randomly'),
});

export const EngineGenerationType = Object.freeze({
    Wasm: Symbol('wasm'),
    Javascript: Symbol('javascript'),
});

export function Ui(
    propsUpdatedCallback,
    playClickedCallback,
    pauseClickedCallback,
    resetClickedCalback
) {
    let cellSize; // px
    let width; // px
    let height; // px
    let numberOfGenerations;
    let ticksAtOnce;
    let throttle; // ms
    let colonyGenerationType;
    let engineGenerationType;

    //
    // HTML elements references
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
    const uiPlayPause = document.getElementById('ui-play-pause');
    const uiReset = document.getElementById('ui-reset');

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

    function propsUpdated() {
        uiPlayPause.textContent = 'PLAY';
        propsUpdatedCallback();
    }

    function setUiCounter(count) {
        uiCounter.textContent = `${count}/${numberOfGenerations}`;
    }

    function setPlayButton() {
        uiPlayPause.textContent = 'PLAY';
    }

    function addEventListeners() {
        for (const radioButton of uiEngineGenerationTypes) {
            radioButton.addEventListener('change', (e) => {
                engineGenerationType =
                    e.target.value === 'wasm'
                        ? EngineGenerationType.Wasm
                        : EngineGenerationType.Javascript;

                uiPlayPause.textContent = 'PLAY';

                propsUpdated();
            });
        }

        function updateWidth(e) {
            const value = parseInt(e.target.value);

            if (!isNaN(value)) {
                width = value;
                propsUpdated();
            }
        }

        uiWidth.addEventListener('change', (e) => updateWidth(e));
        uiWidth.addEventListener('keyup', (e) => updateWidth(e));

        function updateHeight(e) {
            const value = parseInt(e.target.value);

            if (!isNaN(value)) {
                height = value;
                propsUpdated();
            }
        }

        uiHeight.addEventListener('change', (e) => updateHeight(e));
        uiHeight.addEventListener('keyup', (e) => updateHeight(e));

        function updateCellSize(e) {
            const value = parseInt(e.target.value);

            if (!isNaN(value)) {
                cellSize = value;
                propsUpdated();
            }
        }

        uiCellSize.addEventListener('change', (e) => updateCellSize(e));
        uiCellSize.addEventListener('keyup', (e) => updateCellSize(e));

        function updateNumberOfGenerations(e) {
            const value = parseInt(e.target.value);

            if (!isNaN(value)) {
                numberOfGenerations = value;
                setUiCounter(0);
                propsUpdated();
            }
        }

        uiNumberOfGenerations.addEventListener('change', (e) =>
            updateNumberOfGenerations(e)
        );

        uiNumberOfGenerations.addEventListener('keyup', (e) =>
            updateNumberOfGenerations(e)
        );

        function updateGenerationsAtOnce(e) {
            const value = parseInt(e.target.value);

            if (!isNaN(value)) {
                ticksAtOnce = parseInt(e.target.value);
                propsUpdated();
            }
        }

        uiGenerationsAtOnce.addEventListener('change', (e) =>
            updateGenerationsAtOnce(e)
        );

        uiGenerationsAtOnce.addEventListener('keyup', (e) =>
            updateGenerationsAtOnce(e)
        );

        function updateThrottle(e) {
            const value = parseInt(e.target.value);

            if (!isNaN(value)) {
                throttle = parseInt(e.target.value);
                propsUpdated();
            }
        }

        uiThrottle.addEventListener('change', (e) => updateThrottle(e));
        uiThrottle.addEventListener('keyup', (e) => updateThrottle(e));

        for (const radioButton of uiColonyGenerationTypes) {
            radioButton.addEventListener('change', (e) => {
                colonyGenerationType =
                    e.target.value === 'pattern'
                        ? ColonyGenerationType.Pattern
                        : ColonyGenerationType.Randomly;

                uiPlayPause.textContent = 'PLAY';

                propsUpdated();
            });
        }

        uiPlayPause.addEventListener('click', (e) => {
            if (uiPlayPause.textContent === 'PAUSE') {
                uiPlayPause.textContent = 'PLAY';
                pauseClickedCallback();
            } else {
                uiPlayPause.textContent = 'PAUSE';
                playClickedCallback();
            }
        });

        uiReset.addEventListener('click', (e) => {
            uiPlayPause.textContent = 'PLAY';
            resetClickedCalback();
        });
    }
}
