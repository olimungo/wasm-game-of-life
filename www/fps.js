export function Fps() {
    const uiFps = document.getElementById('fps');
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
        const fps = (1 / delta) * 1000;

        // Save only the latest 100 timings.
        frames.push(fps);

        if (frames.length > 100) {
            frames.shift();
        }

        // Find the max, min, and mean of our 100 latest timings.
        let min = Infinity;
        let max = -Infinity;
        let sum = 0;

        for (let i = 0; i < frames.length; i++) {
            sum += frames[i];
            min = Math.min(frames[i], min);
            max = Math.max(frames[i], max);
        }

        let mean = sum / frames.length;

        // Render the statistics.
        uiFps.textContent = `
    FRAMES PER SECOND
    Latest: ${Math.round(fps)}
    Average of last 100: ${Math.round(mean)}
    Minimum of last 100: ${Math.round(min)}
    Maximum of last 100: ${Math.round(max)}
      `.trim();
    }
}
