import {getExternalName} from '../pattern/pattern-type-name';
import {Highlight} from '../entities/highlight';
import {Decoration} from '../entities/decoration';

export default class DecorationEntryFormatter {

    format(decoration: Decoration): Highlight {
        const pattern = decoration.pattern;
        const highlight: Highlight = {
            pattern: {
                type: getExternalName(pattern.type)!,
                expression: pattern.phrase,
                ignoreCase: pattern.ignoreCase,
                wholeMatch: pattern.wholeMatch
            },
            color: decoration.colour
        };
        if (decoration.label) {
            highlight.label = decoration.label;
        }
        return highlight;
    }

}
