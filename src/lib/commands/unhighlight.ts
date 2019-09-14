import DecorationPicker from '../decoration/decoration-picker';
import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import {CommandLike} from '../vscode/vscode';
import {Option} from 'fp-ts/lib/Option';
import {getOptionM} from 'fp-ts/lib/OptionT';
import {task} from 'fp-ts/lib/Task';

export default class UnhighlightCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly decorationPicker: DecorationPicker;

    constructor(decorationOperatorFactory: DecorationOperatorFactory, decorationPicker: DecorationPicker) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.decorationPicker = decorationPicker;
    }

    execute(): Promise<Option<void>> {
        return getOptionM(task).map(this.decorationPicker.pick('Select a pattern to remove highlight'), decoration => {
            const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
            decorationOperator.removeDecoration(decoration.id);
        })();
    }
}
