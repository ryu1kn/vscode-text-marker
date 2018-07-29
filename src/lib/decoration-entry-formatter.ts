import {getExternalName} from './pattern-type-name';

export default class DecorationEntryFormatter {

    format(decoration) {
        const pattern = decoration.pattern;
        return {
            pattern: {
                type: getExternalName(pattern.type),
                expression: pattern.phrase,
                ignoreCase: pattern.ignoreCase,
                wholeMatch: pattern.wholeMatch
            }
        };
    }

}
