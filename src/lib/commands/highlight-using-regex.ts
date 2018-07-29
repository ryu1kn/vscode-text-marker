
export default class HighlightUsingRegexCommand {
    private readonly decorationOperatorFactory: any;
    private readonly regexReader: any;

    constructor(params) {
        this.decorationOperatorFactory = params.decorationOperatorFactory;
        this.regexReader = params.regexReader;
    }

    async execute() {
        const regex = await this.regexReader.read();
        if (!regex) return;

        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.addDecoration(regex);
    }

}
