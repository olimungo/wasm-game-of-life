export const ColonySample = Object.freeze({
    Clear: Symbol('clear'),
    Pattern: Symbol('pattern'),
    Randomly: Symbol('randomly'),
    Blinker: Symbol('Blinker'),
    Glider: Symbol('Glider'),
});

export function Library(itemSelectedCallback) {
    const uiLibraryPanel = document.getElementById('ui-library-panel');
    const uiLibraryList = document.getElementById('ui-library-list');

    uiLibraryPanel.addEventListener('click', () => {
        if (uiLibraryPanel.classList.contains('open')) {
            uiLibraryPanel.classList.remove('open');
        } else {
            uiLibraryPanel.classList.add('open');
        }
    });

    for (let value of Object.keys(ColonySample)) {
        const li = document.createElement('li');

        li.setAttribute('class', 'library-item');
        li.textContent = value;

        li.addEventListener('click', (event) => {
            itemSelectedCallback(event.target.textContent);
        });

        uiLibraryList.appendChild(li);
    }
}
