import { Rle } from './rle';

export function RlePanel(colonyGeneratedCallback, grabColonyCallback) {
    const rle = Rle();

    const uiRlePanel = document.getElementById('ui-rle-panel');
    const uiRleDecode = document.getElementById('ui-rle-decode');
    const uiRleEncode = document.getElementById('ui-rle-encode');
    const uiRleClose = document.getElementById('ui-rle-close');
    const uiRleGrab = document.getElementById('ui-rle-grab');
    const uiRleError = document.getElementById('ui-rle-error');
    const uiRleText = document.getElementById('ui-rle-text');
    const uiRleArrowUp = document.getElementById('ui-rle-arrow-up');
    const uiRleArrowDown = document.getElementById('ui-rle-arrow-down');
    const uiRleArrowLeft = document.getElementById('ui-rle-arrow-left');
    const uiRleArrowRight = document.getElementById('ui-rle-arrow-right');

    uiRleDecode.addEventListener('click', () => {
        uiRleError.textContent = '';

        const { error, ...colonySample } = rle.transformToArrayOfLiveCells(
            uiRleText.value
        );

        if (error) {
            uiRleError.textContent = error;
            return;
        }

        uiRleText.value = JSON.stringify(colonySample.colony);

        colonyGeneratedCallback(colonySample.colony);
    });

    uiRleEncode.addEventListener('click', () => {
        uiRleError.textContent = '';

        const { error, colony } = rle.transformFromArrayOfLiveCells(
            uiRleText.value
        );

        if (error) {
            uiRleError.textContent = error;
        } else {
            colonyGeneratedCallback(JSON.parse(uiRleText.value));
            uiRleText.value = colony;
        }
    });

    uiRleClose.addEventListener('click', () =>
        uiRlePanel.classList.remove('open')
    );

    uiRleArrowUp.addEventListener('click', handleArrowClick);
    uiRleArrowDown.addEventListener('click', handleArrowClick);
    uiRleArrowLeft.addEventListener('click', handleArrowClick);
    uiRleArrowRight.addEventListener('click', handleArrowClick);

    uiRleGrab.addEventListener('click', () => {
        const colony = grabColonyCallback();
        uiRleText.value = JSON.stringify(colony);
    });

    function handleArrowClick(event) {
        let translationX = 0,
            translationY = 0;

        switch (event.currentTarget.id) {
            case 'ui-rle-arrow-up':
                translationY = -1;
                break;
            case 'ui-rle-arrow-down':
                translationY = 1;
                break;
            case 'ui-rle-arrow-left':
                translationX = -1;
                break;
            case 'ui-rle-arrow-right':
                translationX = 1;
                break;
        }

        let jsonColony;

        try {
            jsonColony = JSON.parse(uiRleText.value);
        } catch (error) {
            uiRleError.textContent = `Malformed array of cells. Expected something like '[[1, 32], [2, 55], [3, 55]]'`;
            return;
        }

        const colony = rle.translateLiveCells(
            jsonColony,
            translationX,
            translationY
        );

        uiRleText.value = JSON.stringify(colony);

        colonyGeneratedCallback(colony);
    }
}
