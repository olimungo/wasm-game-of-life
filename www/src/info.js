export function Info() {
    const uiEngine = document.getElementById('ui-engine');
    const uiColonySample = document.getElementById('ui-colony-sample');

    return {
        setEngine,
        setColonySample,
    };

    function setEngine(value) {
        uiEngine.textContent = value;
    }

    function setColonySample(value) {
        uiColonySample.textContent = value;
    }
}
