export function Info() {
    const uiEngine = document.getElementById('ui-engine');
    const uiColonySample = document.getElementById('ui-colony-sample');
    const uiGenrationsCounter = document.getElementById(
        'ui-generations-counter'
    );

    return {
        setEngine,
        setColonySample,
        setGenerationsCounter,
    };

    function setEngine(value) {
        uiEngine.textContent = value;
    }

    function setColonySample(value) {
        uiColonySample.textContent = value;
    }

    function setGenerationsCounter(value) {
        uiGenrationsCounter.textContent = ('0'.repeat(10) + value).slice(-10);
    }
}
