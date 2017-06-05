
const _ = require('lodash');

class TextLocationRegistry {

    constructor() {
        this._recordMap = {};
    }

    record({editorId, decorationId, ranges}) {
        const editorDecorations = Object.assign(
            {},
            this._recordMap[editorId],
            {[decorationId]: ranges}
        );
        Object.assign(
            this._recordMap,
            {[editorId]: editorDecorations}
        );
    }

    queryDecorationId({editorId, offset}) {
        const decorationMap = this._recordMap[editorId];
        const decorationId = _.findKey(decorationMap, ranges =>
            _.some(ranges, range => range.start <= offset && offset <= range.end)
        );
        return decorationId || null;
    }

}

module.exports = TextLocationRegistry;
