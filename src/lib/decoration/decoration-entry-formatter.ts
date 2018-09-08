import {getExternalName} from '../pattern/pattern-type-name';
import {Highlight} from '../entities/highlight';
import {Decoration} from '../entities/decoration';

export default class DecorationEntryFormatter {

    format(decoration: Decoration): Highlight {
        const pattern = decoration.pattern;
        return {
            pattern: {
                type: getExternalName(pattern.type)!,
                expression: pattern.phrase,
                ignoreCase: pattern.ignoreCase,
                wholeMatch: pattern.wholeMatch
            }
        };
    }

}
