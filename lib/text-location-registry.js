
const _ = require('lodash');

class TextLocationRegistry {

    constructor() {
        this._recordMap = {};
    }

    register({editorId, decorationId, ranges}) {
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

    deregister(decorationId) {
        _.forEach(this._recordMap, decorationIdMap => {
            if (decorationIdMap[decorationId]) {
                decorationIdMap[decorationId] = null;
            }
        });
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
