export function Throttle() {
    const uiThrottle = document.getElementById('ui-throttle');
    const uiThrottleValue = document.getElementById('ui-throttle-value');

    let throttle = parseInt(uiThrottleValue.textContent); // ms

    uiThrottle.addEventListener('input', (event) => {
        throttle = event.target.value;
        uiThrottleValue.textContent = throttle;
    });

    return {
        getThrottle,
    };

    //
    // Getters
    //

    function getThrottle() {
        return throttle;
    }
}
