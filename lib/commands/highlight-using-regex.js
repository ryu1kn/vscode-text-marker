
class HighlightUsingRegexCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._regexReader = params.regexReader;
        this._windowComponent = params.windowComponent;
    }

    execute() {
        return this._regexReader.read()
            .then(regex => {
                if (!regex) return;

                const visibleEditors = this._windowComponent.visibleTextEditors;
                const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
                decorationOperator.addDecoration(regex);
            });
    }

}

module.exports = HighlightUsingRegexCommand;
