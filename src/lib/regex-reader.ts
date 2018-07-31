import PatternFactory from './pattern-factory';
import WindowComponent from './editor-components/window';

export default class RegexReader {
    private readonly patternFactory: PatternFactory;
    private readonly windowComponent: WindowComponent;

    constructor(patternFactory, windowComponent) {
        this.patternFactory = patternFactory;
        this.windowComponent = windowComponent;
    }

    async read() {
        const options = this.getInputBoxOption();
        const phrase = await this.windowComponent.showInputBox(options);
        return this.patternFactory.create({
            type: 'RegExp',
            phrase
        });
    }

    private getInputBoxOption() {
        return {placeHolder: 'Enter a regular expression to highlight text'};
    }

}
