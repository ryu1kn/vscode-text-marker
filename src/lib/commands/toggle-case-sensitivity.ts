import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import DecorationPicker from '../decoration/decoration-picker';
import {CommandLike} from '../vscode/vscode';
import {getOptionM} from 'fp-ts/lib/OptionT';
import {task} from 'fp-ts/lib/Task';
import {Option} from 'fp-ts/lib/Option';

export default class ToggleCaseSensitivityCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly decorationPicker: DecorationPicker;

    constructor(decorationOperatorFactory: DecorationOperatorFactory, decorationPicker: DecorationPicker) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.decorationPicker = decorationPicker;
    }

    execute(): Promise<Option<void>> {
        return getOptionM(task).map(this.decorationPicker.pick('Select a pattern to toggle case sensitivity'), decoration => {
            const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
            decorationOperator.updateDecoration(decoration, decoration.withCaseSensitivityToggled());
        })();
    }
}
