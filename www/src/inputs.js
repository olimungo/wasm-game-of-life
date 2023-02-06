import { Throttle } from './throttle';

export const Engine = Object.freeze({
    Wasm: Symbol('wasm'),
    Javascript: Symbol('javascript'),
});

const DEFAULT_COLUMN_COUNT = 50;
const DEFAULT_ROW_COUNT = 50;
const DEFAULT_CELL_SIZE = 5;
const DEFAULT_GENERATIONS_COUNT = 500;
const DEFAULT_GENERATIONS_AT_ONCE = 1;
const GITHUB_REPO_URL = 'https://github.com/olimungo/wasm-game-of-life';

export function Inputs(
    setClickedCallback,
    resetClickedCalback,
    playClickedCallback,
    pauseClickedCallback
) {
    const uiRow = document.getElementById('ui-row');
    const uiColumn = document.getElementById('ui-column');
    const uiCellSize = document.getElementById('ui-cell-size');
    const uiGenerationsCount = document.getElementById('ui-generations-count');
    const uiGenerationsAtOnce = document.getElementById(
        'ui-generations-at-once'
    );
    const uiEngine = document.querySelectorAll('input[name="ui-engine"]');

    // Buttons
    const uiSet = document.getElementById('ui-set');
    const uiPlayPause = document.getElementById('ui-play-pause');
    const uiReset = document.getElementById('ui-reset');
    const uiSourceCode = document.getElementById('ui-source-code');

    let engine;

    const throttle = Throttle();

    init();

    return {
        getProperties,
        setProperties,
        setPlayPause,
    };

    function getProperties() {
        return {
            rowCount: unwrapDefault(uiRow.value, DEFAULT_ROW_COUNT),
            columnCount: unwrapDefault(uiColumn.value, DEFAULT_COLUMN_COUNT),
            cellSize: unwrapDefault(uiCellSize.value, DEFAULT_CELL_SIZE),
            generationsCount: unwrapDefault(
                uiGenerationsCount.value,
                DEFAULT_GENERATIONS_COUNT
            ),
            generationsAtOnce: unwrapDefault(
                uiGenerationsAtOnce.value,
                DEFAULT_GENERATIONS_AT_ONCE
            ),
            throttleValue: throttle.getThrottle(),
            engine,
        };
    }

    function setProperties(properties) {
        const {
            rowCount,
            columnCount,
            cellSize,
            generationsCount,
            generationsAtOnce,
            throttleValue,
        } = properties;

        uiRow.value = rowCount;
        uiColumn.value = columnCount;
        uiCellSize.value = cellSize;
        uiGenerationsCount.value = generationsCount;
        uiGenerationsAtOnce.value = generationsAtOnce;

        throttle.setThrottle(throttleValue);
    }

    function setPlayPause(text) {
        uiPlayPause.textContent = text;
    }

    function unwrapDefault(value, defaultValue) {
        const intValue = parseInt(value);

        if (!isNaN(intValue)) {
            return intValue;
        }

        return defaultValue;
    }

    function init() {
        for (let radioButton of uiEngine) {
            if (radioButton.checked) {
                engine =
                    radioButton.value === 'wasm'
                        ? Engine.Wasm
                        : Engine.Javascript;
            }
        }

        for (const radioButton of uiEngine) {
            radioButton.addEventListener('change', (event) => {
                engine =
                    event.target.value === 'wasm'
                        ? Engine.Wasm
                        : Engine.Javascript;
            });
        }

        uiSet.addEventListener('click', setClickedCallback);
        uiReset.addEventListener('click', resetClickedCalback);

        uiPlayPause.addEventListener('click', (e) => {
            if (uiPlayPause.textContent === 'PAUSE') {
                pauseClickedCallback();
            } else {
                playClickedCallback();
            }
        });

        uiSourceCode.addEventListener('click', () =>
            window.open(GITHUB_REPO_URL, '_blank')
        );
    }
}
