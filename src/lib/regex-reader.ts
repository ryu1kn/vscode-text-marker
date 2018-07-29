
export default class RegexReader {
    private readonly _patternFactory: any;
    private readonly _windowComponent: any;

    constructor(params) {
        this._patternFactory = params.patternFactory;
        this._windowComponent = params.windowComponent;
    }

    async read() {
        const options = this._getInputBoxOption();
        const phrase = await this._windowComponent.showInputBox(options);
        return this._patternFactory.create({
            type: 'RegExp',
            phrase
        });
    }

    private _getInputBoxOption() {
        return {placeHolder: 'Enter a regular expression to highlight text'};
    }

}
