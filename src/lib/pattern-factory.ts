import RegexPattern from './patterns/regex';
import StringPattern from './patterns/string';

export default class PatternFactory {
    private readonly matchingModeRegistry: any;

    constructor({matchingModeRegistry}) {
        this.matchingModeRegistry = matchingModeRegistry;
    }

    create(params) {
        const finalParams = Object.assign({}, this.matchingModeRegistry.mode, params);
        return params.type === 'RegExp' ?
            new RegexPattern(finalParams) :
            new StringPattern(finalParams);
    }

}
