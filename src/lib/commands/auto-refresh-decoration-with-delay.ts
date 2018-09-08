import {Logger} from '../Logger';
import {CommandLike} from '../vscode/vscode';
import WindowComponent from '../vscode/window';
import Debouncer from '../debouncer';
import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import TextEditor from '../vscode/text-editor';

export default class AutoRefreshDecorationWithDelay implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly debouncer: Debouncer;
    private readonly windowComponent: WindowComponent;
    private readonly logger: Logger;

    constructor(decorationOperatorFactory: DecorationOperatorFactory,
                debouncer: Debouncer,
                windowComponent: WindowComponent,
                logger: Logger) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.debouncer = debouncer;
        this.windowComponent = windowComponent;
        this.logger = logger;
    }

    execute() {
        const editor = this.windowComponent.activeTextEditor;
        this.debouncer.debounce(() => {
            try {
                if (editor) this.refresh(editor);
            } catch (e) {
                this.logger.error(e.stack);
            }
        });
    }

    private refresh(editor: TextEditor) {
        const decorationOperator = this.decorationOperatorFactory.create([editor]);
        decorationOperator.refreshDecorations();
    }

}
