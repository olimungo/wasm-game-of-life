export const ColonyGenerationType = Object.freeze({
    Pattern: Symbol('pattern'),
    Randomly: Symbol('randomly'),
});

export const EngineGenerationType = Object.freeze({
    Wasm: Symbol('wasm'),
    Javascript: Symbol('javascript'),
});

export function Inputs(resetCallback) {
    const uiWidth = document.getElementById('ui-width');
    const uiHeight = document.getElementById('ui-height');
    const uiCellSize = document.getElementById('ui-cell-size');
    const uiNumberOfGenerations = document.getElementById(
        'ui-number-of-generations'
    );
    const uiGenerationsAtOnce = document.getElementById(
        'ui-generations-at-once'
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
        setWidth,
        getHeight,
        setHeight,
        getCellSize,
        setCellSize,
        getGenerationsAtOnce,
        getColonyGenerationType,
        getEngineGenerationType,
        getNumberOfGenerations,
    };

    function getWidth() {
        width = unwrapDefault(uiWidth.value, width);

        return width;
    }

    function setWidth(value) {
        width = value;
        uiWidth.value = width;
    }

    function getHeight() {
        height = unwrapDefault(uiHeight.value, height);

        return height;
    }

    function setHeight(value) {
        height = value;
        uiHeight.value = height;
    }

    function getCellSize() {
        cellSize = unwrapDefault(uiCellSize.value, cellSize);

        return cellSize;
    }

    function setCellSize(value) {
        cellSize = value;
        uiCellSize.value = cellSize;
    }

    function getGenerationsAtOnce() {
        generationsAtOnce = unwrapDefault(
            uiGenerationsAtOnce.value,
            generationsAtOnce
        );

        return generationsAtOnce;
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

    function initProperties() {
        for (let radioButton of uiEngineGenerationTypes) {
            if (radioButton.checked) {
                engineGenerationType =
                    radioButton.value === 'wasm'
                        ? EngineGenerationType.Wasm
                        : EngineGenerationType.Javascript;
            }
        }

        width = parseInt(uiWidth.value);
        height = parseInt(uiHeight.value);
        cellSize = parseInt(uiCellSize.value);
        numberOfGenerations = parseInt(uiNumberOfGenerations.value);
        generationsAtOnce = parseInt(uiGenerationsAtOnce.value);
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
    }
}
