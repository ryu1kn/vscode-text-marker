import TextEditor from './text-editor';

export default class TextEditorFactory {
    private _VsRange: any;

    constructor(params) {
        this._VsRange = params.VsRange;
    }

    create(editor) {
        return new TextEditor({
            editor,
            VsRange: this._VsRange
        });
    }

}
