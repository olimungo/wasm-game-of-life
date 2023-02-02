import { Benchmarks } from './benchmarks';
import { Inputs } from './inputs';
import { Library } from './library';
import { Canvas } from './canvas';
import { Fps } from './fps';

export function Ui(
    engineChangedCallback,
    resetCalback,
    playClickedCallback,
    pauseClickedCallback,
    cellClickedCallback,
    colonySampleSelectedCallback
) {
    const inputs = Inputs(
        engineChangedCallback,
        setClicked,
        resetClicked,
        playClickedCallback,
        pauseClickedCallback
    );
    const canvas = Canvas(cellClickedCallback);
    const benchmarks = Benchmarks();
    const library = Library(colonySampleSelected);
    const fps = Fps();

    const uiCounter = document.getElementById('ui-counter');

    let colonySampleId, colony;

    setColonySample(library.getDefaultColonySample());

    return {
        resetGame,
        getProperties,
        updateUi,
        setResults,
        openResults,
        setPlayPause,
    };

    function updateUi(count) {
        uiCounter.textContent = count;
        fps.render();
    }

    function openResults() {
        benchmarks.openResults();
        inputs.setPlayPause('PLAY');
    }

    function setResults(results) {
        benchmarks.setResults(results);
    }

    function setColonySample(colonySample) {
        colonySampleId = colonySample.id;
        colony = colonySample.colony;

        inputs.setProperties(colonySample);

        canvas.setCanvas(
            colonySample.row,
            colonySample.column,
            colonySample.cellSize
        );
    }

    function colonySampleSelected(colonySample) {
        setColonySample(colonySample);
        colonySampleSelectedCallback();
    }

    function getProperties() {
        const properties = inputs.getProperties();

        return {
            ...properties,
            colonySampleId,
            colony,
        };
    }

    function setClicked() {
        const properties = inputs.getProperties();

        canvas.setCanvas(
            properties.row,
            properties.column,
            properties.cellSize
        );

        resetClicked();
    }

    function resetClicked() {
        resetGame();
        resetCalback();
    }

    function resetGame() {
        benchmarks.resetResults();
        uiCounter.textContent = 0;
    }

    function setPlayPause(text) {
        inputs.setPlayPause(text);
    }
}
