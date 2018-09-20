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
        this.decorationRegistry.issue(pattern).map(decoration => {
            this.textDecorator.decorate(this.editors, [decoration]);
        });
    }

    removeDecoration(decorationId: string): void {
        const decoration = this.decorationRegistry.inquireById(decorationId);
        decoration.map(d => this._removeDecoration(d));
    }

    private _removeDecoration(decoration: Decoration) {
        this.decorationRegistry.revoke(decoration.id);
        this.textDecorator.undecorate(this.editors, [decoration.id]);
    }

    updateDecoration(oldDecoration: Decoration, newDecoration: Decoration): void {
        this.decorationRegistry.update(oldDecoration, newDecoration);
        this.textDecorator.undecorate(this.editors, [oldDecoration.id]);
        this.textDecorator.decorate(this.editors, [newDecoration]);
    }

    removeAllDecorations() {
        const decorations = this.decorationRegistry.retrieveAll();
        const decorationIds = decorations.map(d => d.id);
        decorationIds.forEach(decorationId => {
            this.decorationRegistry.revoke(decorationId);
        });
        this.textDecorator.undecorate(this.editors, decorationIds);
    }

    refreshDecorations() {
        const decorations = this.decorationRegistry.retrieveAll();
        this.textDecorator.decorate(this.editors, decorations);
    }

}
