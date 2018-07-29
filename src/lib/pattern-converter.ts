
import {PatternAction} from './const';

export default class PatternConverter {

    convert(pattern, convertAction) {
        switch (convertAction) {
        case PatternAction.TOGGLE_CASE_SENSITIVITY:
            return pattern.toggleCaseSensitivity();
        case PatternAction.TOGGLE_WHOLE_MATCH:
            return pattern.toggleWholeMatch();
        default:
            throw new Error(`Unknown action ${convertAction}`);
        }
    }

}
