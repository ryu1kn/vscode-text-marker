
const PatternAction = require('../const').PatternAction;

class ToggleCaseSensitivityCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._highlightPatternPicker = params.highlightPatternPicker;
        this._windowComponent = params.windowComponent;
    }

    execute() {
        return this._highlightPatternPicker.pick('Select a pattern to toggle case sensitivity')
            .then(decorationId => {
                if (!decorationId) return;

                const visibleEditors = this._windowComponent.visibleTextEditors;
                const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
                decorationOperator.updateDecoration(decorationId, PatternAction.TOGGLE_CASE_SENSITIVITY);
            });
    }

}

module.exports = ToggleCaseSensitivityCommand;
