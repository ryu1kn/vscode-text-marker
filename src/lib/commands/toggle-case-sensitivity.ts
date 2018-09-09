import {PatternAction} from '../pattern/pattern-action';
import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import DecorationPicker from '../decoration/decoration-picker';
import {CommandLike} from '../vscode/vscode';

export default class ToggleCaseSensitivityCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly highlightPatternPicker: DecorationPicker;

    constructor(decorationOperatorFactory: DecorationOperatorFactory, highlightPatternPicker: DecorationPicker) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.highlightPatternPicker = highlightPatternPicker;
    }

    async execute() {
        const decorationId = await this.highlightPatternPicker.pick('Select a pattern to toggle case sensitivity');
        if (!decorationId) return;

        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.updateDecorationWithPatternAction(decorationId, PatternAction.TOGGLE_CASE_SENSITIVITY);
    }

}
