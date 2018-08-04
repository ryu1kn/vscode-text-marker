import TextEditor from '../text-editor';
import {CommandLike} from '../editor-components/vscode';
import DecorationOperatorFactory from '../decoration-operator-factory';

export default class AutoRefreshDecoration implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;

    constructor(decorationOperatorFactory: DecorationOperatorFactory) {
        this.decorationOperatorFactory = decorationOperatorFactory;
    }

    execute(editor?: TextEditor) {
        if (!editor) return;
        const decorationOperator = this.decorationOperatorFactory.create([editor]);
        decorationOperator.refreshDecorations();
    }

}
