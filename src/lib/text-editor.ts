import SelectedTextFinder from './selected-text-finder';

export default class TextEditor {
    private readonly _editor: any;
    private readonly _selectedTextFinder: any;
    private readonly _VsRange: any;

    constructor(params) {
        this._editor = params.editor;
        this._selectedTextFinder = new SelectedTextFinder();
        this._VsRange = params.VsRange;
    }

    get id() {
        return this._editor.document.uri.toString();
    }

    get selectedText() {
        return this._selectedTextFinder.find(this._editor);
    }

    get wholeText() {
        return this._editor.document.getText();
    }

    get flatRange() {
        const selection = this._editor.selection;
        return {
            start: this._getFlatPosition(selection.start),
            end: this._getFlatPosition(selection.end)
        };
    }

    private _getFlatPosition(position) {
        return this._editor.document.offsetAt(position);
    }

    setDecorations(decorationType, ranges) {
        const vsRanges = ranges.map(range =>
            new this._VsRange(
                this._editor.document.positionAt(range.start),
                this._editor.document.positionAt(range.end)
            )
        );
        this._editor.setDecorations(decorationType, vsRanges);
    }

    unsetDecorations(decorationType) {
        this._editor.setDecorations(decorationType, []);
    }

}
