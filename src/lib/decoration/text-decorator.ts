import TextLocationRegistry from '../text-location-registry';
import TextEditor from '../vscode/text-editor';
import {Decoration} from '../entities/decoration';
import {DecorationTypeRegistry} from './decoration-type-registry';

export default class TextDecorator {
    private readonly textLocationRegistry: TextLocationRegistry;
    private readonly decorationTypeRegistry: DecorationTypeRegistry;

    constructor(textLocationRegistry: TextLocationRegistry, decorationTypeRegistry: DecorationTypeRegistry) {
        this.textLocationRegistry = textLocationRegistry;
        this.decorationTypeRegistry = decorationTypeRegistry;
    }

    decorate(editors: TextEditor[], decorations: Decoration[]) {
        editors.forEach(visibleEditor => {
            decorations.forEach(decoration => {
                this.addDecoration(visibleEditor, decoration);
            });
        });
    }

    undecorate(editors: TextEditor[], decorationIds: string[]) {
        decorationIds.forEach(decorationId => {
            editors.forEach(visibleEditor => {
                this.decorationTypeRegistry.inquire(decorationId).map(dt => {
                    visibleEditor.unsetDecorations(dt);
                });
            });
            this.decorationTypeRegistry.revoke(decorationId);
            this.textLocationRegistry.deregister(decorationId);
        });
    }

    private addDecoration(editor: TextEditor, decoration: Decoration) {
        const ranges = decoration.pattern.locateIn(editor.wholeText);
        const decorationType = this.decorationTypeRegistry.provideFor(decoration);
        editor.setDecorations(decorationType, ranges);
        this.textLocationRegistry.register(editor.id, decoration.id, ranges);
    }
}
