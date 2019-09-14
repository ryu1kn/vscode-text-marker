import DecorationPicker from '../decoration/decoration-picker';
import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import {CommandLike} from '../vscode/vscode';
import {getOptionM} from 'fp-ts/lib/OptionT';
import {task} from 'fp-ts/lib/Task';
import {Option} from 'fp-ts/lib/Option';

export default class ToggleWholeMatchCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly decorationPicker: DecorationPicker;

    constructor(decorationOperatorFactory: DecorationOperatorFactory, decorationPicker: DecorationPicker) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.decorationPicker = decorationPicker;
    }

    async execute(): Promise<Option<void>> {
        return getOptionM(task).map(this.decorationPicker.pick('Select a pattern to toggle partial/whole match'), decoration => {
            const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
            decorationOperator.updateDecoration(decoration, decoration.withWholeMatchToggled());
        })();
    }
}
