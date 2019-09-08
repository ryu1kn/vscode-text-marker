import DecorationPicker from '../decoration/decoration-picker';
import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import {CommandLike} from '../vscode/vscode';
import {pipe} from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

export default class UnhighlightCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly decorationPicker: DecorationPicker;

    constructor(decorationOperatorFactory: DecorationOperatorFactory, decorationPicker: DecorationPicker) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.decorationPicker = decorationPicker;
    }

    async execute() {
        pipe(
            await this.decorationPicker.pick('Select a pattern to remove highlight'),
            O.map(decoration => {
                const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
                decorationOperator.removeDecoration(decoration.id);
            })
        );
    }
}
