
export default class RegexReader {
    private readonly patternFactory: any;
    private readonly windowComponent: any;

    constructor(params) {
        this.patternFactory = params.patternFactory;
        this.windowComponent = params.windowComponent;
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
