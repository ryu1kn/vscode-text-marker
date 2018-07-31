import TextEditor from './text-editor';
import {CreateRange} from './editor-components/range';

export default class TextEditorFactory {
    private readonly createRange: CreateRange;

    constructor(createRange) {
        this.createRange = createRange;
    }

    create(editor) {
        return new TextEditor(editor, this.createRange);
    }

}
