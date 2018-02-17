
const PATTERN_TYPE_MAP = new Map([
    ['String', 'string'],
    ['RegExp', 'regex']
]);

exports.getExternalName = internalName => PATTERN_TYPE_MAP.get(internalName);

exports.getInternalName = externalName => {
    const found = Array.from(PATTERN_TYPE_MAP.entries())
        .find(([_iName, eName]) => eName === externalName);
    return found ? found[0] : null;
};
