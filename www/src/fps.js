export function Fps() {
    const uiFpsCounter = document.getElementById('ui-fps-counter');
    const frames = [];
    let lastFrameTimeStamp = performance.now();

    return {
        render,
    };

    function render() {
        // Convert the delta time since the last frame render into a measure
        // of frames per second.
        const now = performance.now();
        const delta = now - lastFrameTimeStamp;
        lastFrameTimeStamp = now;
        let fps = (1 / delta) * 1000;

        if (fps > 200) {
            fps = 0;
        }

        // Render the statistics.
        uiFpsCounter.textContent = (
            '0'.repeat(2) + `${Math.round(fps)}`.trim()
        ).slice(-2);
    }
}
