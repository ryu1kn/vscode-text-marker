
class RegexReader {

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

    _getInputBoxOption() {
        return {placeHolder: 'Enter a regular expression to highlight text'};
    }

}

module.exports = RegexReader;
