import {mock, mockMethods, mockType, verify, when, wrapVerify} from '../../helpers/mock';

import TextDecorator from '../../../lib/decoration/text-decorator';
import PatternFactory from '../../../lib/pattern/pattern-factory';
import TextLocationRegistry from '../../../lib/text-location-registry';
import TextEditor from '../../../lib/vscode/text-editor';
import {Decoration} from '../../../lib/entities/decoration';
import {TextEditorDecorationType} from 'vscode';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';
import {DecorationTypeRegistry} from '../../../lib/decoration/decoration-type-registry';
import {some} from 'fp-ts/lib/Option';

suite('TextDecorator', () => {
    const pattern = createPattern('LONG');
    const decorationType = mockType<TextEditorDecorationType>();
    const decoration0 = mockType<Decoration>({
        pattern,
        id: 'DECORATION_ID'
    });
    const decoration1 = mockType<Decoration>({
        id: 'DECORATION_ID_1'
    });
    const decoration2 = mockType<Decoration>({
        id: 'DECORATION_ID_2'
    });
    const decoration3 = mockType<Decoration>({
        pattern,
        decorationType
    });
    const decoration4 = mockType<Decoration>({
        pattern,
        decorationType: null
    });

    const decorationTypeRegistry = mock(DecorationTypeRegistry);
    when(decorationTypeRegistry.provideFor(decoration0)).thenReturn(decorationType);
    when(decorationTypeRegistry.provideFor(decoration3)).thenReturn(decorationType);

    when(decorationTypeRegistry.inquire('DECORATION_ID_1')).thenReturn(some('DECORATION_TYPE_1'));
    when(decorationTypeRegistry.inquire('DECORATION_ID_2')).thenReturn(some('DECORATION_TYPE_2'));

    test('it decorates the pattern in the editors', () => {
        const editors = [
            mockMethods<TextEditor>(['setDecorations'], {
                id: 'EDITOR_ID_1',
                wholeText: 'ENTIRE LONG LONG TEXT'
            }),
            mockMethods<TextEditor>(['setDecorations'], {
                id: 'EDITOR_ID_2',
                wholeText: 'ANOTHER ENTIRE LONG TEXT'
            })
        ];
        const textLocationRegistry = mock(TextLocationRegistry);
        const textDecorator = new TextDecorator(textLocationRegistry, decorationTypeRegistry);

        textDecorator.decorate(editors, [decoration0]);

        verify(editors[0].setDecorations(decorationType, [{start: 7, end: 11}, {start: 12, end: 16}]));
        verify(editors[1].setDecorations(decorationType, [{start: 15, end: 19}]));
        wrapVerify((c1, c2, c3) => verify(textLocationRegistry.register(c1(), c2(), c3())), [
            [
                'EDITOR_ID_1',
                'DECORATION_ID',
                [{end: 11, start: 7}, {end: 16, start: 12}]
            ], [
                'EDITOR_ID_2',
                'DECORATION_ID',
                [{end: 19, start: 15}]
            ]
        ]);
    });

    test('it removes decorations from the pattern in the editors', () => {
        const editors = [mock(TextEditor), mock(TextEditor)];
        const textLocationRegistry = mock(TextLocationRegistry);
        const textDecorator = new TextDecorator(textLocationRegistry, decorationTypeRegistry);
        textDecorator.undecorate(editors, [decoration1.id, decoration2.id]);

        wrapVerify(capture => verify(editors[0].unsetDecorations(capture())), [
            ['DECORATION_TYPE_1'],
            ['DECORATION_TYPE_2']
        ]);
        wrapVerify(capture => verify(editors[1].unsetDecorations(capture())), [
            ['DECORATION_TYPE_1'],
            ['DECORATION_TYPE_2']
        ]);
        wrapVerify(capture => verify(textLocationRegistry.deregister(capture())), [
            ['DECORATION_ID_1'],
            ['DECORATION_ID_2']
        ]);
    });

    test("it doesn't apply decorations if decorationType is not valid", () => {
        const editor = mockMethods<TextEditor>(['setDecorations'], {
            wholeText: 'ENTIRE LONG LONG TEXT'
        });
        const textLocationRegistry = mockType<TextLocationRegistry>({
            register: () => {
            }
        });
        const textDecorator = new TextDecorator(textLocationRegistry, decorationTypeRegistry);
        textDecorator.decorate([editor], [decoration3, decoration4]);
        verify(editor.setDecorations(decorationType, [{start: 7, end: 11}, {start: 12, end: 16}]));
    });

    function createPattern(phrase: string) {
        const matchingModeRegistry = mockType<MatchingModeRegistry>({mode: {ignoreCase: false}});
        return new PatternFactory(matchingModeRegistry).create({phrase});
    }

});
