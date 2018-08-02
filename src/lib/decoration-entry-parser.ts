import {getInternalName} from './pattern-type-name';
import {Highlight} from './entities/highlight';
import {PatternCreateRequest} from './pattern-factory';

export default class DecorationEntryParser {

    getPattern(decorationData: Highlight): PatternCreateRequest {
        const pattern = decorationData.pattern;
        return {
            type: getInternalName(pattern.type),
            phrase: pattern.expression,
            ignoreCase: pattern.ignoreCase,
            wholeMatch: pattern.wholeMatch
        };
    }

}
