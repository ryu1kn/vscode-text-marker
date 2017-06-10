
const PatternAction = require('../const').PatternAction;

class ToggleWholeMatchCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._highlightPatternPicker = params.highlightPatternPicker;
    }

    execute() {
        return this._highlightPatternPicker.pick('Select a pattern to toggle partial/whole match')
            .then(decorationId => {
                if (!decorationId) return;

                const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
                decorationOperator.updateDecorationPattern(decorationId, PatternAction.TOGGLE_WHOLE_MATCH);
            });
    }

}

module.exports = ToggleWholeMatchCommand;
