
const _ = require('lodash');

class TextDecorationCollection {

    constructor() {
        this._map = Object.create(null);
    }

    add({id, pattern, colour, decorationType}) {
        this._map[id] = {pattern, colour, decorationType};
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
