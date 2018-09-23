import DecorationPicker from '../decoration/decoration-picker';
import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import {CommandLike} from '../vscode/vscode';

export default class UnhighlightCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly decorationPicker: DecorationPicker;

    constructor(decorationOperatorFactory: DecorationOperatorFactory, decorationPicker: DecorationPicker) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.decorationPicker = decorationPicker;
    }

    async execute() {
        const decorationOpt = await this.decorationPicker.pick('Select a pattern to remove highlight');
        decorationOpt.map(decoration => {
            const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
            decorationOperator.removeDecoration(decoration.id);
        });
    }
}
