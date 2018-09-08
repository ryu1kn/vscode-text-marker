import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import {CommandLike} from '../vscode/vscode';

export default class RemoveAllHighlightsCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;

    constructor(decorationOperatorFactory: DecorationOperatorFactory) {
        this.decorationOperatorFactory = decorationOperatorFactory;
    }

    execute() {
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeAllDecorations();
    }

}
