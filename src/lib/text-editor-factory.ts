import TextEditor from './text-editor';

export default class TextEditorFactory {
    private readonly VsRange: any;

    constructor(params) {
        this.VsRange = params.VsRange;
    }

    create(editor) {
        return new TextEditor({
            editor,
            VsRange: this.VsRange
        });
    }

}
