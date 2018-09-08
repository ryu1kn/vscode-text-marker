import {mock, mockMethods, mockType, verify, wrapVerify} from '../helpers/mock';

import TextDecorator from '../../lib/text-decorator';
import PatternFactory from '../../lib/pattern/pattern-factory';
import TextLocationRegistry from '../../lib/text-location-registry';
import TextEditor from '../../lib/text-editor';
import {Decoration} from '../../lib/entities/decoration';
import {TextEditorDecorationType} from 'vscode';
import MatchingModeRegistry from '../../lib/matching-mode-registry';

suite('TextDecorator', () => {

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
        const pattern = createPattern('LONG');
        const textLocationRegistry = mock(TextLocationRegistry);
        const textDecorator = new TextDecorator(textLocationRegistry);
        const decorationType = mockType<TextEditorDecorationType>();
        textDecorator.decorate(
            editors,
            [mockType<Decoration>({
                pattern,
                decorationType,
                id: 'DECORATION_ID'
            })]
        );

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
        const textDecorator = new TextDecorator(textLocationRegistry);
        textDecorator.undecorate(editors, [
            mockType<Decoration>({
                id: 'DECORATION_ID_1',
                decorationType: 'DECORATION_TYPE_1'
            }),
            mockType<Decoration>({
                id: 'DECORATION_ID_2',
                decorationType: 'DECORATION_TYPE_2'
            })
        ]);

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
        const pattern = createPattern('LONG');
        const decorationType = mockType<TextEditorDecorationType>({});
        const textLocationRegistry = mockType<TextLocationRegistry>({register: () => {}});
        const textDecorator = new TextDecorator(textLocationRegistry);
        textDecorator.decorate(
            [editor],
            [
                mockType<Decoration>({
                    pattern,
                    decorationType
                }),
                mockType<Decoration>({
                    pattern,
                    decorationType: null
                })
            ]
        );
        verify(editor.setDecorations(decorationType, [{start: 7, end: 11}, {start: 12, end: 16}]));
    });

    function createPattern(phrase: string) {
        const matchingModeRegistry = mockType<MatchingModeRegistry>({mode: {ignoreCase: false}});
        return new PatternFactory(matchingModeRegistry).create({phrase});
    }

});
