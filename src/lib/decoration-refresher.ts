import DecorationOperatorFactory from './decoration-operator-factory';
import Debouncer from './debouncer';
import TextEditorFactory from './text-editor-factory';
import WindowComponent from './editor-components/window';

export default class DecorationRefresher {
    private readonly logger: Logger;
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly debouncer: Debouncer;
    private readonly textEditorFactory: TextEditorFactory;
    private readonly windowComponent: WindowComponent;

    constructor(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger) {
        this.logger = logger;
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.debouncer = debouncer;
        this.textEditorFactory = textEditorFactory;
        this.windowComponent = windowComponent;
    }

    refresh(editor) {
        if (!editor) return;
        try {
            const textEditor = this.textEditorFactory.create(editor);
            this._refresh(textEditor);
        } catch (e) {
            this.handleError(e);
        }
    }

    private _refresh(editor) {
        const decorationOperator = this.decorationOperatorFactory.create([editor]);
        decorationOperator.refreshDecorations();
    }

    refreshWithDelay(_documentChangeEvent) {
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

    private handleError(e) {
        this.logger.error(e.stack);
    }

}
