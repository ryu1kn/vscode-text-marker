import {expect, sinon} from '../helpers/helper';

import DecorationRefresher from '../../lib/decoration-refresher';

suite('DecorationRefresher', () => {

    suite('#refresh', () => {

        test('it lets DecorationOperator to refresh decorations', () => {
            const editor = {selectedText: 'SELECTED'};
            const textEditorFactory = {create: sinon.stub().returns(editor)};
            const logger = getLogger();
            const decorationOperator = {refreshDecorations: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
            new DecorationRefresher({decorationOperatorFactory, textEditorFactory, logger}).refresh(editor);

            expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
            expect(decorationOperator.refreshDecorations).to.have.been.calledWith();
        });

        test('it does nothing if editor is not given when invoked', () => {
            const editor = undefined;
            const logger = {error: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.spy()};
            new DecorationRefresher({decorationOperatorFactory, logger}).refresh(editor);
            expect(decorationOperatorFactory.create).to.have.been.not.called;
        });

        test('it logs error if an exception occurred', () => {
            const logger = {error: sinon.spy()};
            const textEditorFactory = {
                create: () => {throw new Error('UNEXPECTED_ERROR');}
            };
            new DecorationRefresher({textEditorFactory, logger}).refresh('EDITOR');
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
            const refresher = new DecorationRefresher({debouncer, decorationOperatorFactory, logger, windowComponent});

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
            new DecorationRefresher({decorationOperatorFactory, logger, debouncer, windowComponent}).refreshWithDelay('DOCUMENT_CHANGE_EVENT');
            expect(decorationOperatorFactory.create).to.have.been.not.called;
        });

        test('it logs error if an exception occurred', () => {
            const editor = 'EDITOR';
            const windowComponent = {activeTextEditor: editor};
            const debouncer = {
                debounce: () => {throw new Error('UNEXPECTED_ERROR');}
            };
            const logger = {error: sinon.spy()};
            new DecorationRefresher({logger, debouncer, windowComponent}).refreshWithDelay(editor);
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

    function getLogger() {
        return console;
    }
});
