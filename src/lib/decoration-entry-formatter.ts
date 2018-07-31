import {getExternalName} from './pattern-type-name';
import {Highlight} from './entities/highlight';

export default class DecorationEntryFormatter {

    format(decoration): Highlight {
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
