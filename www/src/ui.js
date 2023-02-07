import { Benchmarks } from './benchmarks';
import { Inputs } from './inputs';
import { Library } from './library';
import { Canvas } from './canvas';
import { Info } from './info';
import { Fps } from './fps';
import { RlePanel } from './rle-panel';

export function Ui(
    resetCalback,
    playClickedCallback,
    pauseClickedCallback,
    cellClickedCallback,
    colonySampleSelectedCallback,
    displayColonyCallback,
    grabColonyCallback
) {
    const inputs = Inputs(
        setClicked,
        resetClicked,
        playClickedCallback,
        pauseClickedCallback
    );
    const canvas = Canvas(cellClickedCallback);
    const benchmarks = Benchmarks();
    const library = Library(colonySampleSelected);
    const info = Info();
    const fps = Fps();

    let colonySampleId, colony;

    // No need to reference the RLE panel, it handles himself.
    // Just need to instantiate it and be aware when to draw something
    // on the canvas.
    RlePanel(displayColonyCallback, grabColonyCallback);

    const properties = inputs.getProperties();
    info.setEngine(properties.engine.description);

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
        info.setGenerationsCounter(count);
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
        info.setColonySample(colonySample.label);

        canvas.setCanvas(
            colonySample.rowCount,
            colonySample.columnCount,
            colonySample.cellSize
        );
    }

    function colonySampleSelected(colonySample) {
        info.setColonySample(colonySample.label);
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
            properties.rowCount,
            properties.columnCount,
            properties.cellSize
        );

        info.setEngine(properties.engine.description);

        resetClicked();
    }

    function resetClicked() {
        resetGame();
        resetCalback();
    }

    function resetGame() {
        benchmarks.resetResults();
        info.setGenerationsCounter(0);
    }

    function setPlayPause(text) {
        inputs.setPlayPause(text);
    }
}
