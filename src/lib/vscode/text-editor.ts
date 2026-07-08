import SelectedTextFinder from './selected-text-finder';
import {
    DecorationOptions,
    MarkdownString,
    Position,
    Range,
    Selection,
    TextEditor as VsTextEditor,
    TextEditorDecorationType,
    TextEditorRevealType
} from 'vscode';
import {FlatRange} from './flat-range';

export default class TextEditor {
    private readonly editor: VsTextEditor;
    private readonly selectedTextFinder: SelectedTextFinder;

    constructor(editor: VsTextEditor) {
        this.editor = editor;
        this.selectedTextFinder = new SelectedTextFinder();
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

    get selection(): FlatRange {
        const selection = this.editor.selection;
        return {
            start: this.getFlatPosition(selection.start),
            end: this.getFlatPosition(selection.end)
        };
    }

    private getFlatPosition(position: Position): number {
        return this.editor.document.offsetAt(position);
    }

    set selection(range: FlatRange) {
        this.editor.revealRange(this.getRange(range), TextEditorRevealType.InCenterIfOutsideViewport);
        this.editor.selection = this.getSelection(range);
    }

    private getSelection(range: FlatRange): Selection {
        return new Selection(this.getPosition(range.start), this.getPosition(range.end));
    }

    private getRange(range: FlatRange): Range {
        return new Range(this.getPosition(range.start), this.getPosition(range.end));
    }

    private getPosition(position: number): Position {
        return this.editor.document.positionAt(position);
    }

    setDecorations(decorationType: TextEditorDecorationType, ranges: FlatRange[], label?: string) {
        const vsOptions: DecorationOptions[] = ranges.map(range => {
            const opt: DecorationOptions = {range: this.getRange(range)};
            if (label) {
                opt.hoverMessage = new MarkdownString(`**${label}**`);
            }
            return opt;
        });
        this.editor.setDecorations(decorationType, vsOptions);
    }

    unsetDecorations(decorationType: TextEditorDecorationType) {
        this.editor.setDecorations(decorationType, []);
    }

}
