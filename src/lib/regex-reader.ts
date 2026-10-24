import {l10n} from 'vscode';
import PatternFactory from './pattern/pattern-factory';
import WindowComponent from './vscode/window';
import MatchingModeRegistry from './matching-mode-registry';
import Pattern from './pattern/pattern';
import {Option} from 'fp-ts/lib/Option';
import {getOptionM} from 'fp-ts/lib/OptionT';
import {task, Task} from 'fp-ts/lib/Task';

export default class RegexReader {
    private readonly patternFactory: PatternFactory;
    private readonly windowComponent: WindowComponent;

    constructor(matchingModeRegistry: MatchingModeRegistry, windowComponent: WindowComponent) {
        this.patternFactory = new PatternFactory(matchingModeRegistry);
        this.windowComponent = windowComponent;
    }

    read(): Task<Option<Pattern>> {
        const options = this.getInputBoxOption();
        const phraseOpt = this.windowComponent.showInputBox(options);
        return getOptionM(task).map(phraseOpt, phrase => this.patternFactory.create({
            type: 'RegExp',
            phrase
        }));
    }

    private getInputBoxOption() {
        return {
            placeHolder: l10n.t('Enter a regular expression without enclosing / characters'),
            validateInput: (phrase: string) => {
                try {
                    RegExp(phrase);
                    return undefined;
                } catch (error) {
                    if (!(error instanceof SyntaxError)) throw error;
                    return l10n.t('Invalid regular expression. Check brackets, escapes and quantifiers.');
                }
            }
        };
    }

}
