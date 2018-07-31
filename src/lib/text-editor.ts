import SelectedTextFinder from './selected-text-finder';
import {TextEditor as VsTextEditor} from 'vscode';
import {FlatRange} from './models/flat-range';
import {CreateRange} from './editor-components/vscode';

export default class TextEditor {
    private readonly editor: VsTextEditor;
    private readonly selectedTextFinder: SelectedTextFinder;
    private readonly createRange: CreateRange;

    constructor(editor, createRange) {
        this.editor = editor;
        this.selectedTextFinder = new SelectedTextFinder();
        this.createRange = createRange;
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

    get flatRange(): FlatRange {
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
            this.createRange(
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
