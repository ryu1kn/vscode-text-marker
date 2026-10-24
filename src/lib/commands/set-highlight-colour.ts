import PatternFactory from '../pattern/pattern-factory';
import MatchingModeRegistry from '../matching-mode-registry';
import TextLocationRegistry from '../text-location-registry';
import DecorationRegistry from '../decoration/decoration-registry';
import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import TextEditor from '../vscode/text-editor';
import {CommandLike} from '../vscode/vscode';
import * as O from 'fp-ts/lib/Option';

/** 为现有高亮换色, 或按所选文本创建指定颜色的高亮. */
export default class SetHighlightColourCommand implements CommandLike {
    private readonly patternFactory: PatternFactory;

    constructor(private readonly colour: string,
                matchingModeRegistry: MatchingModeRegistry,
                private readonly textLocationRegistry: TextLocationRegistry,
                private readonly decorationRegistry: DecorationRegistry,
                private readonly decorationOperatorFactory: DecorationOperatorFactory) {
        this.patternFactory = new PatternFactory(matchingModeRegistry);
    }

    execute(textEditor: TextEditor): void {
        const operator = this.decorationOperatorFactory.createForVisibleEditors();
        const id = this.textLocationRegistry.queryDecorationId(textEditor.id, textEditor.selection);
        if (O.isSome(id)) {
            const existing = this.decorationRegistry.inquireById(id.value);
            if (O.isSome(existing)) {
                operator.updateDecoration(existing.value, existing.value.withColour(this.colour));
            }
            return;
        }
        const phrase = textEditor.selectedText;
        if (!phrase) return;
        const pattern = this.patternFactory.create({phrase});
        // 当前编辑器尚无位置记录时, 仍按规则查找, 避免创建重复高亮.
        const existing = this.decorationRegistry.inquireByPattern(pattern);
        if (O.isSome(existing)) {
            operator.updateDecoration(existing.value, existing.value.withColour(this.colour));
        } else {
            operator.addDecoration(pattern, this.colour);
        }
    }
}
