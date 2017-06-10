
const PatternAction = require('../const').PatternAction;

class ToggleCaseSensitivityCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._highlightPatternPicker = params.highlightPatternPicker;
    }

    execute() {
        return this._highlightPatternPicker.pick('Select a pattern to toggle case sensitivity')
            .then(decorationId => {
                if (!decorationId) return;

                const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
                decorationOperator.updateDecorationPattern(decorationId, PatternAction.TOGGLE_CASE_SENSITIVITY);
            });
    }

}

module.exports = ToggleCaseSensitivityCommand;
