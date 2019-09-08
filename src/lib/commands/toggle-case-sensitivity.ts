import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import DecorationPicker from '../decoration/decoration-picker';
import {CommandLike} from '../vscode/vscode';
import {pipe} from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

export default class ToggleCaseSensitivityCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly decorationPicker: DecorationPicker;

    constructor(decorationOperatorFactory: DecorationOperatorFactory, decorationPicker: DecorationPicker) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.decorationPicker = decorationPicker;
    }

    async execute() {
        pipe(
            await this.decorationPicker.pick('Select a pattern to toggle case sensitivity'),
            O.map(decoration => {
                const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
                decorationOperator.updateDecoration(decoration, decoration.withCaseSensitivityToggled());
            })
        );
    }
}
