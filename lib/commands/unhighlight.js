
class UnhighlightCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._highlightPatternPicker = params.highlightPatternPicker;
        this._windowComponent = params.windowComponent;
    }

    execute() {
        return this._highlightPatternPicker.pick('Select a pattern to remove highlight')
            .then(decorationId => {
                if (!decorationId) return;

                const visibleEditors = this._windowComponent.visibleTextEditors;
                const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
                decorationOperator.removeDecoration(decorationId);
            });
    }

}

module.exports = UnhighlightCommand;
