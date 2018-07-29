import RegexPattern from './patterns/regex';
import StringPattern from './patterns/string';

export default class PatternFactory {
    private readonly _matchingModeRegistry: any;

    constructor({matchingModeRegistry}) {
        this._matchingModeRegistry = matchingModeRegistry;
    }

    create(params) {
        const finalParams = Object.assign({}, this._matchingModeRegistry.mode, params);
        return params.type === 'RegExp' ?
            new RegexPattern(finalParams) :
            new StringPattern(finalParams);
    }

}
