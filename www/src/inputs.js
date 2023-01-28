export const ColonyGenerationType = Object.freeze({
    Pattern: Symbol('pattern'),
    Randomly: Symbol('randomly'),
});

export const EngineGenerationType = Object.freeze({
    Wasm: Symbol('wasm'),
    Javascript: Symbol('javascript'),
});

export function Inputs(resetCallback) {
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

    // Radio buttons
    const uiColonyGenerationTypes = document.querySelectorAll(
        'input[name="ui-colony-generation-type"]'
    );
    const uiEngineGenerationTypes = document.querySelectorAll(
        'input[name="ui-engine-generation-type"]'
    );

    let width; // px
    let height; // px
    let cellSize; // px
    let numberOfGenerations;
    let generationsAtOnce;
    let colonyGenerationType;
    let engineGenerationType;

    initProperties();
    addEventListeners();

    return {
        getWidth,
        getHeight,
        getCellSize,
        getGenerationsAtOnce,
        getColonyGenerationType,
        getEngineGenerationType,
        getNumberOfGenerations,
        setUiCounter,
    };

    //
    // Getters/Setters
    //

    function getWidth() {
        width = unwrapDefault(uiWidth.value, width);

        return width;
    }

    function getHeight() {
        height = unwrapDefault(uiHeight.value, height);

        return height;
    }

    function getGenerationsAtOnce() {
        generationsAtOnce = unwrapDefault(
            uiGenerationsAtOnce.value,
            generationsAtOnce
        );

        return generationsAtOnce;
    }

    function getCellSize() {
        cellSize = unwrapDefault(uiCellSize.value, cellSize);

        return cellSize;
    }

    function getNumberOfGenerations() {
        numberOfGenerations = unwrapDefault(
            uiNumberOfGenerations.value,
            numberOfGenerations
        );

        return numberOfGenerations;
    }

    function getColonyGenerationType() {
        return colonyGenerationType;
    }

    function getEngineGenerationType() {
        return engineGenerationType;
    }

    function setUiCounter(count) {
        uiCounter.textContent = count;
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
        generationsAtOnce = parseInt(uiGenerationsAtOnce.value);

        setUiCounter(0);
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

                resetCallback();
            });
        }

        for (const radioButton of uiColonyGenerationTypes) {
            radioButton.addEventListener('change', (e) => {
                colonyGenerationType =
                    e.target.value === 'pattern'
                        ? ColonyGenerationType.Pattern
                        : ColonyGenerationType.Randomly;

                resetCallback();
            });
        }
    }
}
