
export default class HighlightUsingRegexCommand {
    private readonly _decorationOperatorFactory: any;
    private readonly _regexReader: any;

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._regexReader = params.regexReader;
    }

    async execute() {
        const regex = await this._regexReader.read();
        if (!regex) return;

        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.addDecoration(regex);
    }

}
