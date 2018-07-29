
export default class DecorationOperator {
    private readonly editors: any;
    private readonly decorationRegistry: any;
    private readonly textDecorator: any;
    private readonly patternConverter: any;

    constructor(params) {
        this.editors = params.editors;
        this.decorationRegistry = params.decorationRegistry;
        this.textDecorator = params.textDecorator;
        this.patternConverter = params.patternConverter;
    }

    toggleDecoration(pattern) {
        const decoration = this.decorationRegistry.inquireByPattern(pattern);
        if (decoration) {
            this._removeDecoration(decoration);
        } else {
            this.addDecoration(pattern);
        }
    }

    addDecoration(pattern) {
        const decoration = this.decorationRegistry.issue(pattern);
        if (!decoration) return;

        this.textDecorator.decorate(this.editors, [decoration]);
    }

    removeDecoration(decorationId) {
        const decoration = this.decorationRegistry.inquireById(decorationId);
        this._removeDecoration(decoration);
    }

    private _removeDecoration(decoration) {
        this.decorationRegistry.revoke(decoration.id);
        this.textDecorator.undecorate(this.editors, [decoration]);
    }

    updateDecorationWithPatternAction(decorationId, convertAction) {
        const decoration = this.decorationRegistry.inquireById(decorationId);
        const newPattern = this.patternConverter.convert(decoration.pattern, convertAction);
        this._updateDecorationWithPattern(decoration, newPattern);
    }

    updateDecorationPattern(decorationId, newPattern) {
        const decoration = this.decorationRegistry.inquireById(decorationId);
        this._updateDecorationWithPattern(decoration, newPattern);
    }

    private _updateDecorationWithPattern(decoration, newPattern) {
        this.textDecorator.undecorate(this.editors, [decoration]);

        const newDecoration = this.decorationRegistry.updatePattern(decoration.id, newPattern);
        this.textDecorator.decorate(this.editors, [newDecoration]);
    }

    removeAllDecorations() {
        const decorations = this.decorationRegistry.retrieveAll();
        decorations.forEach(decoration => {
            this.decorationRegistry.revoke(decoration.id);
        });
        this.textDecorator.undecorate(this.editors, decorations);
    }

    refreshDecorations() {
        const decorations = this.decorationRegistry.retrieveAll();
        this.textDecorator.decorate(this.editors, decorations);
    }

}
