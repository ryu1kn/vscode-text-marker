import TextEditor from './text-editor';

export default class TextEditorFactory {
    private readonly VsRange: any;

    constructor(VsRange) {
        this.VsRange = VsRange;
    }

    create(editor) {
        return new TextEditor(editor, this.VsRange);
    }

}
