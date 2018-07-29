import SelectedTextFinder from './selected-text-finder';

export default class TextEditor {
    private readonly editor: any;
    private readonly selectedTextFinder: any;
    private readonly VsRange: any;

    constructor(params) {
        this.editor = params.editor;
        this.selectedTextFinder = new SelectedTextFinder();
        this.VsRange = params.VsRange;
    }

    get id() {
        return this.editor.document.uri.toString();
    }

    get selectedText() {
        return this.selectedTextFinder.find(this.editor);
    }

    get wholeText() {
        return this.editor.document.getText();
    }

    get flatRange() {
        const selection = this.editor.selection;
        return {
            start: this.getFlatPosition(selection.start),
            end: this.getFlatPosition(selection.end)
        };
    }

    private getFlatPosition(position) {
        return this.editor.document.offsetAt(position);
    }

    setDecorations(decorationType, ranges) {
        const vsRanges = ranges.map(range =>
            new this.VsRange(
                this.editor.document.positionAt(range.start),
                this.editor.document.positionAt(range.end)
            )
        );
        this.editor.setDecorations(decorationType, vsRanges);
    }

    unsetDecorations(decorationType) {
        this.editor.setDecorations(decorationType, []);
    }

}
