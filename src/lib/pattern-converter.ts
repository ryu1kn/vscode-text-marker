
import {PatternAction} from './const';
import Pattern from './patterns/pattern';

export default class PatternConverter {

    convert(pattern: Pattern, convertAction: PatternAction) {
        switch (convertAction) {
        case PatternAction.TOGGLE_CASE_SENSITIVITY:
            return pattern.toggleCaseSensitivity();
        case PatternAction.TOGGLE_WHOLE_MATCH:
            return pattern.toggleWholeMatch();
        default:
            throw new Error(`Unknown action ${convertAction.toString()}`);
        }
    }

}
