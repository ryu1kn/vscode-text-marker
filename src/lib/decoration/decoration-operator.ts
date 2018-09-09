import DecorationRegistry from './decoration-registry';
import TextDecorator from './text-decorator';
import TextEditor from '../vscode/text-editor';
import Pattern from '../pattern/pattern';
import {Decoration} from '../entities/decoration';

export default class DecorationOperator {
    private readonly editors: TextEditor[];
    private readonly decorationRegistry: DecorationRegistry;
    private readonly textDecorator: TextDecorator;

    constructor(editors: TextEditor[],
                decorationRegistry: DecorationRegistry,
                textDecorator: TextDecorator) {
        this.editors = editors;
        this.decorationRegistry = decorationRegistry;
        this.textDecorator = textDecorator;
    }

    addDecoration(pattern: Pattern): void {
        const decoration = this.decorationRegistry.issue(pattern);
        if (!decoration) return;

        this.textDecorator.decorate(this.editors, [decoration]);
    }

    removeDecoration(decorationId: string): void {
        const decoration = this.decorationRegistry.inquireById(decorationId);
        decoration.map(d => this._removeDecoration(d));
    }

    private _removeDecoration(decoration: Decoration) {
        this.decorationRegistry.revoke(decoration.id);
        this.textDecorator.undecorate(this.editors, [decoration]);
    }

    updateDecorationPattern(decoration: Decoration, newPattern: Pattern): void {
        this.textDecorator.undecorate(this.editors, [decoration]);

        const newDecoration = this.decorationRegistry.updatePattern(decoration.id, newPattern);
        newDecoration.map(d => {
            this.textDecorator.decorate(this.editors, [d]);
        });
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
