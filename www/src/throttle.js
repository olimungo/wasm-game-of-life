export function Throttle() {
    const uiThrottle = document.getElementById('ui-throttle');
    const uiThrottleValue = document.getElementById('ui-throttle-value');

    let throttle; // ms

    uiThrottle.addEventListener('input', (event) => {
        throttle = event.target.value;
        uiThrottleValue.textContent = throttle;
    });

    return {
        getThrottle,
        setThrottle,
    };

    function getThrottle() {
        return throttle;
    }

    function setThrottle(value) {
        throttle = value;

        uiThrottle.value = throttle;
        uiThrottleValue.textContent = throttle;
    }
}
