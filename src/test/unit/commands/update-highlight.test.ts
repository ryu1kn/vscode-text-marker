import {any, expect, mock, sinon, stubWithArgs, verify} from '../../helpers/helper';

import UpdateHighlightCommand from '../../../lib/commands/update-highlight';
import DecorationOperatorFactory from "../../../lib/decoration-operator-factory";
import DecorationRegistry from "../../../lib/decoration-registry";
import PatternVariationReader from "../../../lib/pattern-variation-reader";

suite('UpdateHighlightCommand', () => {

    suite('When the cursor is on highlight', () => {

        test('it update decoration if the cursor is on highlight', async () => {
            const editor = {selectedText: null};
            const textEditorFactory = {create: () => editor};
            const textLocationRegistry = {queryDecorationId: () => 'DECORATION_ID'};
            const decorationOperator = {updateDecorationPattern: sinon.spy()};
            const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
            const decorationRegistry = {inquireById: stubWithArgs(['DECORATION_ID'], {pattern: 'PATTERN'})};
            const patternVariationReader = {read: stubWithArgs(['PATTERN'], Promise.resolve('NEW_PATTERN'))};
            const command = new UpdateHighlightCommand(
                decorationOperatorFactory,
                decorationRegistry,
                patternVariationReader,
                textEditorFactory,
                textLocationRegistry
            );

            await command.execute(editor);

            expect(patternVariationReader.read).to.have.been.calledWith('PATTERN');
            expect(decorationOperator.updateDecorationPattern).to.have.been.calledWith('DECORATION_ID', 'NEW_PATTERN');
        });

        test('it does nothing if a new pattern is not given by user', async () => {
            const editor = {selectedText: null};
            const textEditorFactory = {create: () => editor};
            const textLocationRegistry = {queryDecorationId: () => 'DECORATION_ID'};
            const decorationOperatorFactory = {createForVisibleEditors: sinon.spy()};
            const decorationRegistry = {inquireById: () => ({pattern: 'CURRENT_PATTERN'})};
            const patternVariationReader = {read: () => Promise.resolve()};
            const command = new UpdateHighlightCommand(
                decorationOperatorFactory,
                decorationRegistry,
                patternVariationReader,
                textEditorFactory,
                textLocationRegistry
            );

            await command.execute(editor);

            expect(decorationOperatorFactory.createForVisibleEditors).to.not.have.been.called;
        });
    });

    suite('When the cursor is on highlight', () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const decorationRegistry = mock(DecorationRegistry);
        const patternVariationReader = mock(PatternVariationReader);

        test('it does nothing if the cursor is not on highlight', async () => {
            const editor = {selectedText: null};
            const textEditorFactory = {create: () => editor};
            const textLocationRegistry = {queryDecorationId: () => null};
            const command = new UpdateHighlightCommand(
                decorationOperatorFactory,
                decorationRegistry,
                patternVariationReader,
                textEditorFactory,
                textLocationRegistry
            );

            await command.execute(editor);

            verify(decorationRegistry.inquireById(any()), {times: 0});
        });
    });
});
