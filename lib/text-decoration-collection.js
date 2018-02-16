
class TextDecorationCollection {

    constructor({generateUuid}) {
        this._generateUuid = generateUuid;

        this._map = new Map();
    }

    add({pattern, colour, decorationType}) {
        const id = this._generateUuid();
        const decoration = {id, pattern, colour, decorationType};
        this._map.set(id, decoration);
        return decoration;
    }

    get(id) {
        return this._map.get(id);
    }

    remove(id) {
        this._map.delete(id);
    }

    find(predicate) {
        return Array.from(this._map.values())
            .find(decoration => predicate(decoration)) || null;
    }

    toList() {
        return Array.from(this._map.values())
            .reduce((result, decoration) => [...result, decoration], []);
    }

}

module.exports = TextDecorationCollection;
