import DecorationOperatorFactory from '../decoration-operator-factory';
import RegexReader from '../regex-reader';
import {CommandLike} from '../editor-components/vscode';
import MatchingModeRegistry from '../matching-mode-registry';
import WindowComponent from '../editor-components/window';

export default class HighlightUsingRegexCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly regexReader: RegexReader;

    constructor(decorationOperatorFactory: DecorationOperatorFactory,
                matchingModeRegistry: MatchingModeRegistry,
                windowComponent: WindowComponent) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.regexReader = new RegexReader(matchingModeRegistry, windowComponent);
    }

    async execute() {
        const regex = await this.regexReader.read();
        if (!regex) return;

        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.addDecoration(regex);
    }

}
