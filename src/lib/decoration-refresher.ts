import DecorationOperatorFactory from './decoration-operator-factory';
import Debouncer from './debouncer';
import TextEditorFactory from './text-editor-factory';
import WindowComponent from './editor-components/window';
import {Logger} from './Logger';
import {TextEditor as VsTextEditor} from 'vscode';
import TextEditor from './text-editor';

export default class DecorationRefresher {
    private readonly logger: Logger;
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly debouncer: Debouncer;
    private readonly textEditorFactory: TextEditorFactory;
    private readonly windowComponent: WindowComponent;

    constructor(decorationOperatorFactory: DecorationOperatorFactory,
                debouncer: Debouncer,
                textEditorFactory: TextEditorFactory,
                windowComponent: WindowComponent,
                logger: Logger) {
        this.logger = logger;
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.debouncer = debouncer;
        this.textEditorFactory = textEditorFactory;
        this.windowComponent = windowComponent;
    }

    refresh(editor?: VsTextEditor) {
        if (!editor) return;
        try {
            const textEditor = this.textEditorFactory.create(editor);
            this._refresh(textEditor);
        } catch (e) {
            this.handleError(e);
        }
    }

    private _refresh(editor: TextEditor) {
        const decorationOperator = this.decorationOperatorFactory.create([editor]);
        decorationOperator.refreshDecorations();
    }

    refreshWithDelay(_documentChangeEvent: any) {
        try {
            const editor = this.windowComponent.activeTextEditor;
            this.debouncer.debounce(() => {
                try {
                    if (editor) this._refresh(editor);
                } catch (e) {
                    this.handleError(e);
                }
            });
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(e: Error) {
        this.logger.error(e.stack!);
    }

}
