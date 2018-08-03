import {mockMethods} from '../../helpers/helper';

export const createFakeEditor = ({selectedText, wholeText}: any = {}) => {
    return mockMethods(['setDecorations'], {
        document: {
            getText: (selection: any) => selection ? selectedText : wholeText,
            positionAt: position,
            offsetAt: offset,
            uri: 'EDITOR_ID'
        },
        selection: createSelection(selectedText, wholeText)
    });
};

function createSelection(selectedText: any, wholeText: any) {
    if (!selectedText) return null;
    return {
        start: position(wholeText.indexOf(selectedText)),
        end: position(wholeText.indexOf(selectedText) + selectedText.length)
    };
}

function position(offset: any) {
    return `POSITION:${offset}`;
}

function offset(position: any) {
    const POS_PREFIX = 'POSITION:';
    return position.startsWith(POS_PREFIX) && parseInt(position.replace(POS_PREFIX, ''), 10);
}
