import {expect, sinon} from '../../helpers/helper';

import ToggleHighlightCommand from '../../../lib/commands/toggle-highlight';

suite('ToggleHighlightCommand', () => {

    test('it decorates a selected text if the cursor is not on highlight', () => {
        const editor = {selectedText: 'SELECTED'};
        const textEditorFactory = {create: sinon.stub().returns(editor)};
        const textLocationRegistry = {queryDecorationId: () => null};
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const command = new ToggleHighlightCommand({
            decorationOperatorFactory,
            patternFactory,
            textEditorFactory,
            textLocationRegistry
        });
        command.execute(editor);

        expect(patternFactory.create).to.have.been.calledWith({phrase: 'SELECTED'});
        expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
    });

    test('it remove decoration if the cursor is on highlight', () => {
        const editor = {selectedText: null};
        const textEditorFactory = {create: sinon.stub().returns(editor)};
        const textLocationRegistry = {queryDecorationId: () => 'DECORATION_ID'};
        const decorationOperator = {removeDecoration: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const command = new ToggleHighlightCommand({
            decorationOperatorFactory,
            patternFactory,
            textEditorFactory,
            textLocationRegistry
        });
        command.execute(editor);

        expect(decorationOperator.removeDecoration).to.have.been.calledWith('DECORATION_ID');
    });

    test('it does nothing if text is not selected', () => {
        const editor = 'EDITOR';
        const decorationOperatorFactory = {createForVisibleEditors: sinon.spy()};
        const textLocationRegistry = {queryDecorationId: () => null};
        const textEditorFactory = {create: () => ({selectedText: null})};
        const command = new ToggleHighlightCommand({decorationOperatorFactory, textEditorFactory, textLocationRegistry});
        command.execute(editor);

        expect(decorationOperatorFactory.createForVisibleEditors).to.have.been.not.called;
    });

});
