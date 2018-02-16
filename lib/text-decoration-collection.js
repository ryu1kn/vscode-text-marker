
const _ = require('lodash');

class TextDecorationCollection {

    constructor({generateUuid}) {
        this._generateUuid = generateUuid;

        this._map = Object.create(null);
    }

    add({pattern, colour, decorationType}) {
        const id = this._generateUuid();
        const decoration = {pattern, colour, decorationType};
        this._map[id] = decoration;
        return Object.assign({id}, decoration);
    }

    get(id) {
        const value = this._map[id];
        return value ? Object.assign({id}, value) : null;
    }

    remove(id) {
        this._map[id] = null;
    }

    find(predicate) {
        const id = _.findKey(this._map, decoration => decoration && predicate(decoration));
        return id ? Object.assign({id}, this._map[id]) : null;
    }

    toList() {
        return _.reduce(this._map,
            (result, value, key) => value ? [...result, Object.assign({id: key}, value)] : result,
            []
        );
    }

}

module.exports = TextDecorationCollection;
