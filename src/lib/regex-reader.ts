import PatternFactory from './pattern/pattern-factory';
import WindowComponent from './editor-components/window';
import MatchingModeRegistry from './matching-mode-registry';
import Pattern from './pattern/pattern';
import {Option} from 'fp-ts/lib/Option';

export default class RegexReader {
    private readonly patternFactory: PatternFactory;
    private readonly windowComponent: WindowComponent;

    constructor(matchingModeRegistry: MatchingModeRegistry, windowComponent: WindowComponent) {
        this.patternFactory = new PatternFactory(matchingModeRegistry);
        this.windowComponent = windowComponent;
    }

    async read(): Promise<Option<Pattern>> {
        const options = this.getInputBoxOption();
        const phraseOpt = await this.windowComponent.showInputBox(options);
        return phraseOpt.map(phrase => this.patternFactory.create({
            type: 'RegExp',
            phrase
        }));
    }

    private getInputBoxOption() {
        return {placeHolder: 'Enter a regular expression to highlight text'};
    }

}
