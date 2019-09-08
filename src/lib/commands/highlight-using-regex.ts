import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import RegexReader from '../regex-reader';
import {CommandLike} from '../vscode/vscode';
import MatchingModeRegistry from '../matching-mode-registry';
import WindowComponent from '../vscode/window';
import {getOptionT2v} from 'fp-ts/lib/OptionT';
import {task} from 'fp-ts/lib/Task';

export default class HighlightUsingRegexCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly regexReader: RegexReader;

    constructor(decorationOperatorFactory: DecorationOperatorFactory,
                matchingModeRegistry: MatchingModeRegistry,
                windowComponent: WindowComponent) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.regexReader = new RegexReader(matchingModeRegistry, windowComponent);
    }

    execute() {
        return getOptionT2v(task).map(this.regexReader.read(), regex => {
            const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
            decorationOperator.addDecoration(regex);
        }).run();
    }
}
