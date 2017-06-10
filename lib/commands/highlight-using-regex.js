
class HighlightUsingRegexCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._regexReader = params.regexReader;
    }

    execute() {
        return this._regexReader.read()
            .then(regex => {
                if (!regex) return;

                const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
                decorationOperator.addDecoration(regex);
            });
    }

}

module.exports = HighlightUsingRegexCommand;
