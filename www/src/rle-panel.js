import { Rle } from './rle';

export function RlePanel(colonyGeneratedCallback) {
    const rle = Rle();

    const uiRleDecode = document.getElementById('ui-rle-decode');
    const uiRleEncode = document.getElementById('ui-rle-encode');
    const uiRleClose = document.getElementById('ui-rle-close');
    const uiRleError = document.getElementById('ui-rle-error');
    const uiRleText = document.getElementById('ui-rle-text');

    uiRleDecode.addEventListener('click', () => {
        const colonySample = rle.transformToArrayOfLiveCells(uiRleText.value);

        uiRleText.value = JSON.stringify(colonySample.colony);

        colonyGeneratedCallback(colonySample);
    });

    uiRleEncode.addEventListener('click', () => {
        uiRleText.value = rle.transformFromArrayOfLiveCells(uiRleText.value);
    });

    uiRleClose.addEventListener('click', () => {
        console.log('click Close');
    });

    return {};
}
