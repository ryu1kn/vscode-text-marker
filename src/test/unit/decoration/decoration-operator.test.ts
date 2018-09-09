import {any, mock, mockType, verify, when, wrapVerify} from '../../helpers/mock';

import DecorationOperator from '../../../lib/decoration/decoration-operator';
import PatternConverter from '../../../lib/pattern/pattern-converter';
import TextEditor from '../../../lib/vscode/text-editor';
import DecorationRegistry from '../../../lib/decoration/decoration-registry';
import StringPattern from '../../../lib/pattern/string';
import TextDecorator from '../../../lib/decoration/text-decorator';
import {Decoration} from '../../../lib/entities/decoration';
import {TextEditorDecorationType} from 'vscode';
import {some} from 'fp-ts/lib/Option';
import {PatternAction} from '../../../lib/pattern/pattern-action';

suite('DecorationOperator', () => {

    const patternConverter = mock(PatternConverter);

    suite('#addDecoration', () => {

        const editors = [mock(TextEditor)];
        const pattern = mock(StringPattern);

        test('it highlights all the strings match to the given pattern', () => {
            const decorationRegistry = mock(DecorationRegistry);
            const decoration = {} as Decoration;
            when(decorationRegistry.issue(pattern)).thenReturn(decoration);
            const textDecorator = mock(TextDecorator);
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);

            operator.addDecoration(pattern);

            verify(textDecorator.decorate(editors, [decoration]));
        });

        test('it does nothing if given pattern is already registered for highlight', () => {
            const decorationRegistry = mock(DecorationRegistry);
            when(decorationRegistry.issue(pattern)).thenReturn(null);
            const textDecorator = mock(TextDecorator);
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
            operator.addDecoration(pattern);

            verify(textDecorator.decorate(any(), any()), {times: 0});
        });
    });

    suite('#removeDecoration', () => {

        const editors = [mock(TextEditor), mock(TextEditor)];
        const decoration = mockType<Decoration>({
            id: 'DECORATION_ID',
            decorationType: {} as TextEditorDecorationType
        });

        test('it removes a decoration', () => {
            const decorationRegistry = mock(DecorationRegistry);
            when(decorationRegistry.inquireById('DECORATION_ID')).thenReturn(some(decoration));
            const textDecorator = mock(TextDecorator);
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);

            operator.removeDecoration('DECORATION_ID');

            verify(decorationRegistry.revoke('DECORATION_ID'));
            verify(textDecorator.undecorate(editors, [decoration]));
        });
    });

    suite('Update Decoration', () => {

        const editors = [mock(TextEditor), mock(TextEditor)];
        const oldPattern = mock(StringPattern);
        const newPattern = mock(StringPattern);
        const decorationType = mockType<TextEditorDecorationType>({});
        const patternConvertAction = PatternAction.TOGGLE_CASE_SENSITIVITY;
        const oldDecoration = mockType<Decoration>({
            id: 'DECORATION_ID',
            decorationType: decorationType,
            pattern: oldPattern
        });
        const newDecoration = mockType<Decoration>({
            id: 'DECORATION_ID',
            decorationType: decorationType,
            pattern: newPattern
        });

        const decorationRegistry = mock(DecorationRegistry);
        when(decorationRegistry.updatePattern('DECORATION_ID', newPattern)).thenReturn(some(newDecoration));
        when(decorationRegistry.inquireById('DECORATION_ID')).thenReturn(some(oldDecoration));

        suite('#updateDecorationWithPatternAction', () => {

            test('it toggles a case sensitivity of a decoration pattern', () => {
                const textDecorator = mock(TextDecorator);
                const patternConverter = mock(PatternConverter);
                when(patternConverter.convert(oldPattern, patternConvertAction)).thenReturn(newPattern);

                const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
                operator.updateDecorationWithPatternAction(oldDecoration, patternConvertAction);

                verify(textDecorator.undecorate(editors, [oldDecoration]));
                verify(textDecorator.decorate(editors, [newDecoration]));
            });
        });

        suite('#updateDecorationPattern', () => {

            test('it updates a pattern of a decoration', () => {
                const textDecorator = mock(TextDecorator);
                const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);

                operator.updateDecorationPattern(oldDecoration, newPattern);

                verify(textDecorator.undecorate(editors, [oldDecoration]));
                verify(textDecorator.decorate(editors, [newDecoration]));
            });
        });
    });


    suite('#refreshDecorations', () => {

        test('it sets all currently active decorations to visible the given editor', () => {
            const editors = [mock(TextEditor)];
            const decorations = [mockType<Decoration>({})];
            const decorationRegistry = mock(DecorationRegistry);
            when(decorationRegistry.retrieveAll()).thenReturn(decorations);
            const textDecorator = mock(TextDecorator);
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
            operator.refreshDecorations();

            verify(textDecorator.decorate(editors, decorations));
        });
    });

    suite('#removeAllDecorations', () => {

        test('it removes all currently active decorations', () => {
            const editors = [mock(TextEditor), mock(TextEditor)];
            const decorations = [
                mockType<Decoration>({id: 'DECORATION_ID_1'}),
                mockType<Decoration>({id: 'DECORATION_ID_2'})
            ];
            const decorationRegistry = mock(DecorationRegistry);
            when(decorationRegistry.retrieveAll()).thenReturn(decorations);
            const textDecorator = mock(TextDecorator);
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
            operator.removeAllDecorations();

            wrapVerify(capture => verify(decorationRegistry.revoke(capture())), [['DECORATION_ID_1'], ['DECORATION_ID_2']]);
            verify(textDecorator.undecorate(editors, decorations));
        });
    });
});
