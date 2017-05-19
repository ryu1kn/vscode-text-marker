
class MarkTextCommand {

    constructor(params) {
        this._vsWindow = params.vsWindow;
        this._logger = params.logger;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._selectedTextFinder = params.selectedTextFinder;
    }

    execute(editor) {
        try {
            const selectedText = this._selectedTextFinder.find(editor); // TODO: consider selectionS
            if (!selectedText) return;

            const visibleEditors = this._vsWindow.visibleTextEditors;
            const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
            decorationOperator.toggleDecoration(selectedText);
        } catch (e) {
            this._handleError(e);
        }
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = MarkTextCommand;
