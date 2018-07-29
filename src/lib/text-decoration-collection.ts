
export default class TextDecorationCollection {
    private readonly generateUuid: any;
    private readonly map: any;

    constructor({generateUuid}) {
        this.generateUuid = generateUuid;

        this.map = new Map();
    }

    add({pattern, colour, decorationType}) {
        const id = this.generateUuid();
        const decoration = {id, pattern, colour, decorationType};
        this.map.set(id, decoration);
        return decoration;
    }

    get(id) {
        return this.map.get(id);
    }

    remove(id) {
        this.map.delete(id);
    }

    find(predicate) {
        return Array.from(this.map.values())
            .find(decoration => predicate(decoration)) || null;
    }

    toList() {
        return Array.from(this.map.values())
            .reduce((result: any[], decoration) => [...result, decoration], []);
    }

}
