import DecorationOperatorFactory from '../decoration-operator-factory';
import RegexReader from '../regex-reader';
import {CommandLike} from '../editor-components/vscode';

export default class HighlightUsingRegexCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly regexReader: RegexReader;

    constructor(decorationOperatorFactory: DecorationOperatorFactory, regexReader: RegexReader) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.regexReader = regexReader;
    }

    async execute() {
        const regex = await this.regexReader.read();
        if (!regex) return;

        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.addDecoration(regex);
    }

}
