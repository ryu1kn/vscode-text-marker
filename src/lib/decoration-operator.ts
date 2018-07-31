import DecorationRegistry from './decoration-registry';
import TextDecorator from './text-decorator';
import PatternConverter from './pattern-converter';
import TextEditor from './text-editor';

export default class DecorationOperator {
    private readonly editors: TextEditor[];
    private readonly decorationRegistry: DecorationRegistry;
    private readonly textDecorator: TextDecorator;
    private readonly patternConverter: PatternConverter;

    constructor(editors, decorationRegistry, textDecorator, patternConverter) {
        this.editors = editors;
        this.decorationRegistry = decorationRegistry;
        this.textDecorator = textDecorator;
        this.patternConverter = patternConverter;
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
