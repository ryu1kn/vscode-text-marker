
export const EXTENSION_ID = 'textmarker';

export const EXTENSION_NAME = 'TextMarker';

export const Event = {
    EXTENSION_READY: Symbol('text-marker-ready'),
    TOGGLED_CASE_SENSITIVITY: Symbol('case-sensitivity-toggled'),
    MATCHING_MODE_INITIALISED: Symbol('matching-mode-initialised'),
    WHOLE_MATCH_MODE_TOGGLED: Symbol('whole-match-mode-toggled')
};

export const PatternAction = {
    TOGGLE_CASE_SENSITIVITY: Symbol('toggle-case-sensitivity'),
    TOGGLE_WHOLE_MATCH: Symbol('toggle-whole-match'),
    UPDATE_PHRASE: Symbol('update-phrase')
};
