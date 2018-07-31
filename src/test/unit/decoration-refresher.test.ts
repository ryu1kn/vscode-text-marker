import {expect, mock, sinon} from '../helpers/helper';

import DecorationRefresher from '../../lib/decoration-refresher';
import WindowComponent from '../../lib/editor-components/window';
import Debouncer from '../../lib/debouncer';
import TextEditorFactory from '../../lib/text-editor-factory';
import DecorationOperatorFactory from '../../lib/decoration-operator-factory';

suite('DecorationRefresher', () => {

    suite('#refresh', () => {

        test('it lets DecorationOperator to refresh decorations', () => {
            const editor = {selectedText: 'SELECTED'};
            const textEditorFactory = {create: sinon.stub().returns(editor)};
            const logger = getLogger();
            const decorationOperator = {refreshDecorations: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
            const debouncer = mock(Debouncer);
            const windowComponent = mock(WindowComponent);
            new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger).refresh(editor);

            expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
            expect(decorationOperator.refreshDecorations).to.have.been.calledWith();
        });

        test('it does nothing if editor is not given when invoked', () => {
            const editor = undefined;
            const logger = {error: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.spy()};
            const debouncer = mock(Debouncer);
            const textEditorFactory = mock(TextEditorFactory);
            const windowComponent = mock(WindowComponent);
            new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger).refresh(editor);
            expect(decorationOperatorFactory.create).to.have.been.not.called;
        });

        test('it logs error if an exception occurred', () => {
            const logger = {error: sinon.spy()};
            const textEditorFactory = {
                create: () => {throw new Error('UNEXPECTED_ERROR');}
            };
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            const debouncer = mock(Debouncer);
            const windowComponent = mock(WindowComponent);
            new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger).refresh('EDITOR');
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

    suite('#refreshWithDelay', () => {

        test('it refreshes text markups but debounce the execution', () => {
            const editor = 'EDITOR';
            const windowComponent = {activeTextEditor: editor};
            const logger = getLogger();
            const decorationOperator = {refreshDecorations: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
            const debouncer = {debounce: sinon.stub().callsArg(0)};
            const textEditorFactory = mock(TextEditorFactory);
            const refresher = new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger);

            refresher.refreshWithDelay('DOCUMENT_CHANGE_EVENT');

            expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
            expect(decorationOperator.refreshDecorations).to.have.been.calledWith();
        });

        test('it does nothing if editor is not given when invoked', () => {
            const editor = undefined;
            const windowComponent = {activeTextEditor: editor};
            const logger = {error: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.spy()};
            const debouncer = {debounce: callback => callback()};
            const textEditorFactory = mock(TextEditorFactory);
            new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger).refreshWithDelay('DOCUMENT_CHANGE_EVENT');
            expect(decorationOperatorFactory.create).to.have.been.not.called;
        });

        test('it logs error if an exception occurred', () => {
            const editor = 'EDITOR';
            const windowComponent = {activeTextEditor: editor};
            const debouncer = {
                debounce: () => {throw new Error('UNEXPECTED_ERROR');}
            };
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            const textEditorFactory = mock(TextEditorFactory);
            const logger = {error: sinon.spy()};
            new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger).refreshWithDelay(editor);
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

    function getLogger() {
        return console;
    }
});
