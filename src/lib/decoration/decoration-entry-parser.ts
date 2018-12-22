import {getInternalName} from '../pattern/pattern-type-name';
import {Highlight} from '../entities/highlight';
import {PatternParams} from '../pattern/pattern-factory';

export default class DecorationEntryParser {

    getPattern(decorationData: Highlight): PatternParams {
        const pattern = decorationData.pattern;
        return {
            type: getInternalName(pattern.type),
            phrase: pattern.expression,
            ignoreCase: pattern.ignoreCase,
            wholeMatch: pattern.wholeMatch
        };
    }

}
