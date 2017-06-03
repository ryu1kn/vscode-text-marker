
module.exports = {

    EXTENSION_ID: 'textmarker',

    EXTENSION_NAME: 'TextMarker',

    Event: {
        EXTENSION_READY: Symbol('text-marker-ready'),
        TOGGLED_CASE_SENSITIVITY: Symbol('case-sensitivity-toggled'),
        MATCHING_MODE_INITIALISED: Symbol('matching-mode-initialised')
    },

    PatternAction: {
        TOGGLE_CASE_SENSITIVITY: Symbol('toggle-case-sensitivity'),
        TOGGLE_WHOLE_MATCH: Symbol('toggle-whole-match')
    }

};
