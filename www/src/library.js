import { colonySamples, DEFAULT_SAMPLE } from './colony-samples';

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

    for (let [index, item] of colonySamples.entries()) {
        const li = document.createElement('li');
        li.id = index;

        li.setAttribute('class', 'library-item');
        li.textContent = item.label;

        li.addEventListener('click', (event) => {
            itemSelectedCallback(colonySamples[index]);
        });

        uiLibraryList.appendChild(li);
    }

    return {
        getDefaultSample,
    };

    function getDefaultSample() {
        return colonySamples[DEFAULT_SAMPLE];
    }
}
