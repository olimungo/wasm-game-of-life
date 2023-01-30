export function Benchmarks() {
    const uiBenchmarksPanel = document.getElementById('ui-benchmarks-panel');
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
    const uiAutomaticOpenSwitch = document.getElementById(
        'ui-automatic-open-switch'
    );
    const uiAutomaticOpenBallContainer = document.getElementById(
        'ui-automatic-open-ball-container'
    );
    const uiAutomaticOpenBall = document.getElementById(
        'ui-automatic-open-ball'
    );
    const uiAutomaticOpenLabel = document.getElementById(
        'ui-automatic-open-label'
    );

    uiBenchmarksPanel.addEventListener('click', (event) => {
        event.preventDefault();

        if (
            event.target === uiAutomaticOpenBallContainer ||
            event.target === uiAutomaticOpenBall ||
            event.target === uiAutomaticOpenLabel
        ) {
            uiAutomaticOpenSwitch.checked = !uiAutomaticOpenSwitch.checked;
        } else {
            if (uiBenchmarksPanel.classList.contains('open')) {
                uiBenchmarksPanel.classList.remove('open');
            } else {
                uiBenchmarksPanel.classList.add('open');
            }
        }
    });

    return {
        openResults,
        setResults,
        resetResults,
    };

    function openResults() {
        if (uiAutomaticOpenSwitch.checked) {
            if (!uiBenchmarksPanel.classList.contains('open')) {
                uiBenchmarksPanel.classList.add('open');
            }
        }
    }

    function formatMilliseconds(element, value) {
        element.textContent = (Math.round(value * 100) / 100).toFixed(2);
    }

    function setResults(results) {
        formatMilliseconds(uiTotalDuration, results.totalDuration);
        formatMilliseconds(uiTotalTicksDuration, results.totalTicksDuration);
        formatMilliseconds(uiAverageTickDuration, results.averageTickDuration);
        formatMilliseconds(uiTotalRedrawDuration, results.totalRedrawDuration);
        formatMilliseconds(
            uiAverageRedrawDuration,
            results.averageRedrawDuration
        );
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
