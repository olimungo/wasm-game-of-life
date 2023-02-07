import { colonySamples, DEFAULT_COLONY_SAMPLE } from './colony-samples';

export function Library(colonySampleSelectedCallback) {
    const uiLibraryPanel = document.getElementById('ui-library-panel');
    const uiLibraryList = document.getElementById('ui-library-list');
    const uiLibraryRle = document.getElementById('ui-library-rle');
    const uiRlePanel = document.getElementById('ui-rle-panel');

    uiLibraryPanel.addEventListener('click', () => {
        if (uiLibraryPanel.classList.contains('open')) {
            uiLibraryPanel.classList.remove('open');
        } else {
            uiLibraryPanel.classList.add('open');
        }
    });

    // If the library is open and a the user clicks outside
    // of the library panel, then close the panel
    document.addEventListener('click', (event) => {
        if (
            !uiLibraryPanel.contains(event.target) &&
            uiLibraryPanel.classList.contains('open')
        ) {
            uiLibraryPanel.classList.remove('open');
        }
    });

    for (let [index, item] of colonySamples.entries()) {
        const li = document.createElement('li');
        li.id = index;

        li.setAttribute('class', 'library-item');
        li.textContent = item.label;

        li.addEventListener('click', () => {
            colonySampleSelectedCallback(colonySamples[index]);
        });

        uiLibraryList.appendChild(li);
    }

    uiLibraryRle.addEventListener('click', () => {
        if (!uiRlePanel.classList.contains('open')) {
            uiRlePanel.classList.add('open');
        } else {
            uiRlePanel.classList.remove('open');
        }
    });

    return {
        getDefaultColonySample,
    };

    function getDefaultColonySample() {
        return colonySamples[DEFAULT_COLONY_SAMPLE];
    }
}
