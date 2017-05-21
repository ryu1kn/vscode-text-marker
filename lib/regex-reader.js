
class RegexReader {

    constructor(params) {
        this._vsWindow = params.vsWindow;
    }

    read() {
        const state = {};
        return Promise.resolve(state)
            .then(state => this._letUserToEnterRegex(state))
            .then(state => state.pattern);
    }

    _letUserToEnterRegex(state) {
        const options = this._getInputBoxOption();
        return this._vsWindow.showInputBox(options)
            .then(pattern => Object.assign({}, state, {
                pattern: new RegExp(pattern)
            }));
    }

    _getInputBoxOption() {
        return {placeHolder: 'Enter a regular expression to highlight text'};
    }

}

module.exports = RegexReader;
